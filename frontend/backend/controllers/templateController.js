/**
 * Template Controller
 * Handles template and category browsing and administration.
 */

const Template = require('../models/Template');

exports.getAllTemplates = (req, res, next) => {
  try {
    const templates = Template.getAll();
    const categories = Template.getCategories();
    return res.json({
      success: true,
      templates,
      categories
    });
  } catch (err) {
    next(err);
  }
};

exports.getTemplateById = (req, res, next) => {
  try {
    const template = Template.getById(req.params.id);
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found.' });
    }
    return res.json({ success: true, template });
  } catch (err) {
    next(err);
  }
};

exports.getByCategory = (req, res, next) => {
  try {
    const templates = Template.getByCategory(req.params.type);
    return res.json({ success: true, category: req.params.type, templates });
  } catch (err) {
    next(err);
  }
};

exports.createTemplate = (req, res, next) => {
  try {
    const { category_id, name, description, price, preview_image } = req.body;
    if (!category_id || !name) {
      return res.status(400).json({ success: false, message: 'category_id and name are required.' });
    }

    const template = Template.create({ category_id, name, description, price, preview_image });
    return res.status(201).json({ success: true, template });
  } catch (err) {
    next(err);
  }
};

exports.updateTemplate = (req, res, next) => {
  try {
    const updated = Template.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Template not found.' });
    }
    return res.json({ success: true, template: updated });
  } catch (err) {
    next(err);
  }
};

exports.deleteTemplate = (req, res, next) => {
  try {
    const deleted = Template.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Template not found.' });
    }
    return res.json({ success: true, message: 'Template successfully removed.' });
  } catch (err) {
    next(err);
  }
};
