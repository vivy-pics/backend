export * from "./external";
export { createClient } from "edgedb";
import * as $ from "./reflection";
import * as $syntax from "./syntax";
import * as $op from "./operators";
import _std from "./modules/std";
import _cal from "./modules/cal";
import _cfg from "./modules/cfg";
import _default from "./modules/default";
import _schema from "./modules/schema";
import _sys from "./modules/sys";
import _math from "./modules/math";

const ExportDefault: typeof _std & 
  typeof _default & 
  $.util.OmitDollarPrefixed<typeof $syntax> & 
  typeof $op & {
  "std": typeof _std;
  "cal": typeof _cal;
  "cfg": typeof _cfg;
  "default": typeof _default;
  "schema": typeof _schema;
  "sys": typeof _sys;
  "math": typeof _math;
} = {
  ..._std,
  ..._default,
  ...$.util.omitDollarPrefixed($syntax),
  ...$op,
  "std": _std,
  "cal": _cal,
  "cfg": _cfg,
  "default": _default,
  "schema": _schema,
  "sys": _sys,
  "math": _math,
};
const Cardinality = $.Cardinality;
type Cardinality = $.Cardinality;
export type Set<
  Type extends $.BaseType,
  Card extends $.Cardinality = $.Cardinality.Many
> = $.TypeSet<Type, Card>;


export default ExportDefault;
export { Cardinality };
