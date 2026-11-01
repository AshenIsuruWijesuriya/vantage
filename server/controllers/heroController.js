import HeroSlide from '../models/HeroSlide.js';

// Only these fields can be set from a request
const FIELDS = ['image', 'eyebrow', 'headline', 'text', 'buttonText', 'buttonLink', 'isActive'];
const pickFields = (body = {}) =>
  Object.fromEntries(FIELDS.filter((f) => body[f] !== undefined).map((f) => [f, body[f]]));

const byPosition = { position: 1, createdAt: 1 };

// GET /api/hero  (public) – slides shown on the home page
export const getActiveSlides = async (req, res) => {
  res.json(await HeroSlide.find({ isActive: true }).sort(byPosition));
};

// GET /api/hero/all  (admin) – every slide, including hidden ones
export const getAllSlides = async (req, res) => {
  res.json(await HeroSlide.find().sort(byPosition));
};

// POST /api/hero  (admin) – new slides go to the end
export const createSlide = async (req, res) => {
  const last = await HeroSlide.findOne().sort({ position: -1 });
  const slide = await HeroSlide.create({
    ...pickFields(req.body),
    position: last ? last.position + 1 : 0,
  });
  res.status(201).json(slide);
};

// PUT /api/hero/:id  (admin)
export const updateSlide = async (req, res) => {
  const slide = await HeroSlide.findByIdAndUpdate(req.params.id, pickFields(req.body), {
    returnDocument: 'after',
    runValidators: true,
  });
  if (!slide) {
    res.status(404);
    throw new Error('Slide not found');
  }
  res.json(slide);
};

// DELETE /api/hero/:id  (admin)
export const deleteSlide = async (req, res) => {
  const slide = await HeroSlide.findByIdAndDelete(req.params.id);
  if (!slide) {
    res.status(404);
    throw new Error('Slide not found');
  }
  res.json({ message: 'Slide deleted' });
};

// PUT /api/hero/reorder  (admin)  body: { ids: ['id1', 'id2', ...] } in the new order
export const reorderSlides = async (req, res) => {
  const ids = req.body?.ids;
  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400);
    throw new Error('Send the slide ids in their new order');
  }
  await Promise.all(ids.map((id, position) => HeroSlide.updateOne({ _id: id }, { position })));
  res.json(await HeroSlide.find().sort(byPosition));
};