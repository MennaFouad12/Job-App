export const create = async ({ model, data = {} }) => {
  const documnet = await model.create(data);
  return documnet;
};

export const find = async ({
  model,
  filter = {},
  select = "",
  populate = [],
  skip = 0,
  limit = 1000,
}) => {
  const documnet = await model
    .find(filter)
    .select(select)
    .populate(populate)
    .skip(skip)
    .limit(limit);
  return documnet;
};

export const findOne = async ({
  model,
  filter = {},
  select = "",
  populate = [],
}) => {
  const documnet = await model
    .findOne(filter)
    .populate(populate)
    .select(select);

  return documnet;
};

export const findById = async ({
  model,
  id = "",
  select = "",
  populate = [],
}) => {
  const documnet = await model.findById(id).select(select).populate(populate);
  return documnet;
};

export const findByIdAndUpdate = async ({
  model,
  id = "",
  data = {},
  options = {},
  select = "",
  populate = [],
}) => {
  const documnet = await model
    .findByIdAndUpdate(id, data, options)
    .select(select)
    .populate(populate);

  return documnet;
};

export const findOneAndUpdate = async ({
  model,
  filter = {},
  data = {},
  options = {},
  select = "",
  populate = [],
}) => {
  const documnet = await model
    .findByIdAndUpdate(filter, data, options)
    .select(select)
    .populate(populate);

  return documnet;
};

export const updateOne = async ({
  model,
  filter = {},
  data = {},
  options = {},
}) => {
  const documnet = await model.updateOne(filter, data, options);
  return documnet;
};

export const updateMany = async ({
  model,
  filter = {},
  data = {},
  options = {},
}) => {
  const documnet = await model.updateOne(filter, data, options);
  return documnet;
};

export const findByIdAndDelete = async ({ model, id = "" }) => {
  const documnet = await model.findByIdAndDelete(id);
  return documnet;
};

export const findOneAndDelete = async ({ model, filter = {} }) => {
  const documnet = await model.findByIdAndUpdate(filter);

  return documnet;
};

export const deleteOne = async ({ model, filter = {} }) => {
  const documnet = await model.updateOne(filter);
  return documnet;
};

export const deleteMany = async ({ model, filter = {} }) => {
  const documnet = await model.updateOne(filter);
  return documnet;
};
