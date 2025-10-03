import Template from '../models/Template.js';

export const getAllTemplates = async (req, res) => {
  try {
    const { category, published } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (published !== undefined) filter.is_published = published === 'true';

    const templates = await Template.find(filter).sort({ createdAt: -1 });
    res.json({ templates });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch templates', message: error.message });
  }
};

export const getTemplateById = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    res.json({ template });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch template', message: error.message });
  }
};

export const createTemplate = async (req, res) => {
  try {
    const { name, description, category, sections, scoring_rules, conditional_logic } = req.body;

    if (!name || !category) {
      return res.status(400).json({ error: 'Name and category are required' });
    }

    const template = new Template({
      name,
      description,
      category,
      sections: sections || [],
      scoring_rules: scoring_rules || { enabled: false },
      conditional_logic: conditional_logic || [],
      is_published: false
    });

    await template.save();
    res.status(201).json({ template, message: 'Template created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create template', message: error.message });
  }
};

export const updateTemplate = async (req, res) => {
  try {
    const { name, description, category, sections, scoring_rules, conditional_logic } = req.body;

    const template = await Template.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        category,
        sections,
        scoring_rules,
        conditional_logic
      },
      { new: true, runValidators: true }
    );

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    res.json({ template, message: 'Template updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update template', message: error.message });
  }
};

export const publishTemplate = async (req, res) => {
  try {
    const template = await Template.findByIdAndUpdate(
      req.params.id,
      { is_published: true },
      { new: true }
    );

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    res.json({ template, message: 'Template published successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to publish template', message: error.message });
  }
};

export const deleteTemplate = async (req, res) => {
  try {
    const template = await Template.findByIdAndDelete(req.params.id);

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete template', message: error.message });
  }
};
