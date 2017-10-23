import { NAMESPACE_SEP } from './constants';

// model里reducers或者effects里含有加了namespace前缀的type则返回加了前缀的type.否则返回原type
export default function prefixType(type, model) {
  const prefixedType = `${model.namespace}${NAMESPACE_SEP}${type}`;
  const typeWithoutAffix = prefixedType.replace(/\/@@[^/]+?$/, '');
  if ((model.reducers && model.reducers[typeWithoutAffix])
    || (model.effects && model.effects[typeWithoutAffix])) {
    return prefixedType;
  }
  return type;
}
