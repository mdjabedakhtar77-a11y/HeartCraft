/**
 * Template Model & Repository
 * Encapsulates access to templates, categories, and template styles.
 */

const { getDatabase } = require('../config/database');

class Template {
  constructor(data = {}) {
    this.id = data.id;
    this.category_id = data.category_id;
    this.name = data.name;
    this.description = data.description;
    this.price = data.price;
    this.preview_image = data.preview_image;
    this.is_active = data.is_active !== undefined ? data.is_active : true;
    this.created_at = data.created_at;
    this.category = data.category || null;
    this.styles = data.styles || [];
  }

  static getAll(includeInactive = false) {
    const db = getDatabase();
    const categories = db.find('categories');
    const styles = db.find('template_styles');
    const templates = db.find('templates', t => includeInactive ? true : t.is_active);

    return templates.map(t => {
      const cat = categories.find(c => Number(c.id) === Number(t.category_id));
      const tStyles = styles.filter(s => Number(s.template_id) === Number(t.id));
      return new Template({
        ...t,
        category: cat ? cat.name : 'General',
        category_slug: cat ? cat.slug : 'general',
        styles: tStyles
      });
    });
  }

  static getById(id) {
    const db = getDatabase();
    const template = db.findById('templates', id);
    if (!template) return null;

    const category = db.findById('categories', template.category_id);
    const styles = db.find('template_styles', s => Number(s.template_id) === Number(id));

    return new Template({
      ...template,
      category: category ? category.name : 'General',
      category_slug: category ? category.slug : 'general',
      styles
    });
  }

  static getByCategory(categorySlug) {
    const db = getDatabase();
    const category = db.findOne('categories', c => c.slug.toLowerCase() === categorySlug.toLowerCase());
    if (!category) return [];

    const templates = db.find('templates', t => Number(t.category_id) === Number(category.id) && t.is_active);
    const styles = db.find('template_styles');

    return templates.map(t => new Template({
      ...t,
      category: category.name,
      category_slug: category.slug,
      styles: styles.filter(s => Number(s.template_id) === Number(t.id))
    }));
  }

  static getCategories() {
    const db = getDatabase();
    return db.find('categories');
  }

  static create(data) {
    const db = getDatabase();
    const record = db.insert('templates', {
      category_id: Number(data.category_id),
      name: data.name,
      description: data.description,
      price: 0,
      preview_image: data.preview_image,
      is_active: data.is_active !== undefined ? Boolean(data.is_active) : true
    });
    return new Template(record);
  }

  static update(id, updates) {
    const db = getDatabase();
    const updated = db.update('templates', id, updates);
    return updated ? new Template(updated) : null;
  }

  static delete(id) {
    const db = getDatabase();
    return db.delete('templates', id);
  }
}

module.exports = Template;
