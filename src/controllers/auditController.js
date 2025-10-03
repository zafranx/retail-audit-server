import Audit from '../models/Audit.js';
import Template from '../models/Template.js';

export const getAllAudits = async (req, res) => {
  try {
    const { status, assigned_to } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (assigned_to) filter.assigned_to = assigned_to;

    const audits = await Audit.find(filter)
      .populate('template_id', 'name category')
      .sort({ createdAt: -1 });

    res.json({ audits });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audits', message: error.message });
  }
};

export const getAuditById = async (req, res) => {
  try {
    const audit = await Audit.findById(req.params.id).populate('template_id');

    if (!audit) {
      return res.status(404).json({ error: 'Audit not found' });
    }

    res.json({ audit });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit', message: error.message });
  }
};

export const createAudit = async (req, res) => {
  try {
    const { template_id, assigned_to, location } = req.body;

    const template = await Template.findById(template_id);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    const audit = new Audit({
      template_id,
      template_name: template.name,
      assigned_to: assigned_to || 'field_user',
      location: location || {},
      status: 'Pending',
      responses: new Map()
    });

    await audit.save();
    res.status(201).json({ audit, message: 'Audit created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create audit', message: error.message });
  }
};

export const updateAudit = async (req, res) => {
  try {
    const { status, responses, location } = req.body;

    const audit = await Audit.findByIdAndUpdate(
      req.params.id,
      { status, responses, location },
      { new: true, runValidators: true }
    ).populate('template_id');

    if (!audit) {
      return res.status(404).json({ error: 'Audit not found' });
    }

    res.json({ audit, message: 'Audit updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update audit', message: error.message });
  }
};

export const submitAudit = async (req, res) => {
  try {
    const { responses } = req.body;

    const audit = await Audit.findById(req.params.id).populate('template_id');

    if (!audit) {
      return res.status(404).json({ error: 'Audit not found' });
    }

    const template = audit.template_id;
    const score = calculateScore(responses, template.sections, template.scoring_rules);

    audit.responses = responses;
    audit.score = score;
    audit.status = 'Completed';
    audit.submitted_at = new Date();

    await audit.save();

    res.json({ audit, message: 'Audit submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit audit', message: error.message });
  }
};

const calculateScore = (responses, sections, scoringRules) => {
  if (!scoringRules || !scoringRules.enabled || !scoringRules.weights) {
    return null;
  }

  let totalScore = 0;

  sections.forEach(section => {
    const sectionId = section.section_id;
    const sectionResponses = responses[sectionId] || {};
    const questions = section.questions || [];

    let sectionPoints = 0;
    let maxPoints = 0;

    questions.forEach(question => {
      const answer = sectionResponses[question.question_id];
      maxPoints += 10;

      if (answer) {
        if (question.type === 'single_choice' || question.type === 'multiple_choice') {
          sectionPoints += 10;
        } else if (answer !== '') {
          sectionPoints += 10;
        }
      }
    });

    const sectionWeight = scoringRules.weights.get(sectionId) || 0;
    const sectionScore = maxPoints > 0 ? (sectionPoints / maxPoints) * sectionWeight : 0;
    totalScore += sectionScore;
  });

  return parseFloat(totalScore.toFixed(2));
};

export const deleteAudit = async (req, res) => {
  try {
    const audit = await Audit.findByIdAndDelete(req.params.id);

    if (!audit) {
      return res.status(404).json({ error: 'Audit not found' });
    }

    res.json({ message: 'Audit deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete audit', message: error.message });
  }
};
