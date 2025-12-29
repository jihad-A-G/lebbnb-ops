import { Request, Response } from 'express';
import Contact from '../models/Contact.model';
import { sendContactNotification, sendContactReply } from '../config/email';

// Create contact submission (Public)
export const createContact = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get IP address
    const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';

    const contact = await Contact.create({
      ...req.body,
      ipAddress
    });

    // Send email notification (don't wait for it to complete)
    sendContactNotification({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      message: contact.message,
      createdAt: contact.createdAt,
    }).catch(err => {
      // Log error but don't fail the request
      console.error('Failed to send contact notification email:', err);
    });

    res.status(201).json({
      status: 'success',
      message: 'Thank you for contacting us! We will get back to you soon.',
      data: { contact }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to submit contact form',
      error: error.message
    });
  }
};

// Get all contacts (Admin)
export const getAllContacts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    // Build filter
    const filter: any = {};
    if (status) filter.status = status;

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [contacts, total] = await Promise.all([
      Contact.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Contact.countDocuments(filter)
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        contacts,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch contacts',
      error: error.message
    });
  }
};

// Get single contact (Admin)
export const getContactById = async (req: Request, res: Response): Promise<void> => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      res.status(404).json({
        status: 'error',
        message: 'Contact not found'
      });
      return;
    }

    // Mark as read if status is new
    if (contact.status === 'new') {
      contact.status = 'read';
      await contact.save();
    }

    res.status(200).json({
      status: 'success',
      data: { contact }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch contact',
      error: error.message
    });
  }
};

// Update contact status (Admin)
export const updateContactStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      res.status(404).json({
        status: 'error',
        message: 'Contact not found'
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      message: 'Contact status updated successfully',
      data: { contact }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update contact status',
      error: error.message
    });
  }
};

// Delete contact (Admin)
export const deleteContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      res.status(404).json({
        status: 'error',
        message: 'Contact not found'
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      message: 'Contact deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete contact',
      error: error.message
    });
  }
};

// Get contact statistics (Admin)
export const getContactStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await Contact.countDocuments();

    res.status(200).json({
      status: 'success',
      data: {
        total,
        byStatus: stats.reduce((acc: any, stat: any) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {})
      }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch contact statistics',
      error: error.message
    });
  }
};

// Reply to contact (Admin)
export const replyToContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reply } = req.body;
    const { id } = req.params;

    if (!reply || !reply.trim()) {
      res.status(400).json({
        status: 'error',
        message: 'Reply message is required'
      });
      return;
    }

    // Find the contact
    const contact = await Contact.findById(id);

    if (!contact) {
      res.status(404).json({
        status: 'error',
        message: 'Contact not found'
      });
      return;
    }

    // Update contact with reply
    contact.reply = reply.trim();
    contact.replyDate = new Date();
    contact.status = 'replied';
    await contact.save();

    // Send reply email to the contact
    try {
      await sendContactReply({
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        originalMessage: contact.message,
        reply: contact.reply!,
      });

      res.status(200).json({
        status: 'success',
        message: 'Reply sent successfully',
        data: { contact }
      });
    } catch (emailError: any) {
      // If email fails, still save the reply but inform the admin
      res.status(200).json({
        status: 'success',
        message: 'Reply saved but email sending failed. Please contact manually.',
        data: { contact },
        warning: emailError.message
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to send reply',
      error: error.message
    });
  }
};
