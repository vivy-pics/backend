import * as $ from "../reflection";
import * as _ from "../imports";
import type * as _std from "./std";
export type $Id = $.ScalarType<"std::number", number>;
const Id: $.scalarTypeWithConstructor<_std.$number, string> = $.makeType<$.scalarTypeWithConstructor<_std.$number, string>>(_.spec, "cb9297f9-5f4a-11ed-a241-97464c6a7dca", _.syntax.literal);

export type $PoolλShape = $.typeutil.flatten<_std.$Object_9d92cf705b2511ed848a275bef45d8e3λShape & {
  "owner": $.LinkDesc<$User, $.Cardinality.One, {}, false, false,  false, false>;
  "posts": $.LinkDesc<$Post, $.Cardinality.Many, {}, false, false,  false, false>;
  "name": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "number": $.PropertyDesc<$Id, $.Cardinality.AtMostOne, true, false, false, true>;
}>;
type $Pool = $.ObjectType<"default::Pool", $PoolλShape, null, [
  ..._std.$Object_9d92cf705b2511ed848a275bef45d8e3['__exclusives__'],
  {number: {__element__: $Id, __cardinality__: $.Cardinality.AtMostOne},},
]>;
const $Pool = $.makeType<$Pool>(_.spec, "cb92a75b-5f4a-11ed-b75a-894b4b7899ef", _.syntax.literal);

const Pool: $.$expr_PathNode<$.TypeSet<$Pool, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Pool, $.Cardinality.Many), null);

export type $PostλShape = $.typeutil.flatten<_std.$Object_9d92cf705b2511ed848a275bef45d8e3λShape & {
  "owner": $.LinkDesc<$User, $.Cardinality.One, {}, false, false,  false, false>;
  "variant_of": $.LinkDesc<$Post, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "deleted_at": $.PropertyDesc<_std.$datetime, $.Cardinality.AtMostOne, false, false, false, false>;
  "deletion_reason": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "hash": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, true, false>;
  "likes": $.PropertyDesc<_std.$int32, $.Cardinality.One, false, false, false, true>;
  "number": $.PropertyDesc<$Id, $.Cardinality.AtMostOne, true, false, false, true>;
  "posted_at": $.PropertyDesc<_std.$datetime, $.Cardinality.One, false, false, true, true>;
  "soft_deleted": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, true>;
  "nsfw": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, true>;
  "<variant_of[is Post]": $.LinkDesc<$Post, $.Cardinality.Many, {}, false, false,  false, false>;
  "<posts[is Pool]": $.LinkDesc<$Pool, $.Cardinality.Many, {}, false, false,  false, false>;
  "<posts[is Tag]": $.LinkDesc<$Tag, $.Cardinality.Many, {}, false, false,  false, false>;
  "<posts": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<variant_of": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Post = $.ObjectType<"default::Post", $PostλShape, null, [
  ..._std.$Object_9d92cf705b2511ed848a275bef45d8e3['__exclusives__'],
  {number: {__element__: $Id, __cardinality__: $.Cardinality.AtMostOne},},
]>;
const $Post = $.makeType<$Post>(_.spec, "cb98a351-5f4a-11ed-bbf8-177ee261af3d", _.syntax.literal);

const Post: $.$expr_PathNode<$.TypeSet<$Post, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Post, $.Cardinality.Many), null);

export type $TagλShape = $.typeutil.flatten<_std.$Object_9d92cf705b2511ed848a275bef45d8e3λShape & {
  "posts": $.LinkDesc<$Post, $.Cardinality.Many, {}, false, false,  false, false>;
  "name": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, false, false>;
  "persistent": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, true>;
}>;
type $Tag = $.ObjectType<"default::Tag", $TagλShape, null, [
  ..._std.$Object_9d92cf705b2511ed848a275bef45d8e3['__exclusives__'],
  {name: {__element__: _std.$str, __cardinality__: $.Cardinality.One},},
]>;
const $Tag = $.makeType<$Tag>(_.spec, "cb9cdb2e-5f4a-11ed-a423-6d1ac2e647ac", _.syntax.literal);

const Tag: $.$expr_PathNode<$.TypeSet<$Tag, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Tag, $.Cardinality.Many), null);

export type $UserλShape = $.typeutil.flatten<_std.$Object_9d92cf705b2511ed848a275bef45d8e3λShape & {
  "email": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "username": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "clean_username": $.PropertyDesc<_std.$str, $.Cardinality.One, false, true, false, false>;
  "banned": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, true>;
  "is_moderator": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, true>;
  "last_used_ip": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "number": $.PropertyDesc<$Id, $.Cardinality.AtMostOne, true, false, false, true>;
  "password_hash": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "<owner[is Pool]": $.LinkDesc<$Pool, $.Cardinality.Many, {}, false, false,  false, false>;
  "<owner[is Post]": $.LinkDesc<$Post, $.Cardinality.Many, {}, false, false,  false, false>;
  "<owner": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $User = $.ObjectType<"default::User", $UserλShape, null, [
  ..._std.$Object_9d92cf705b2511ed848a275bef45d8e3['__exclusives__'],
  {number: {__element__: $Id, __cardinality__: $.Cardinality.AtMostOne},},
]>;
const $User = $.makeType<$User>(_.spec, "cb94791a-5f4a-11ed-bcf5-57210272bdce", _.syntax.literal);

const User: $.$expr_PathNode<$.TypeSet<$User, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($User, $.Cardinality.Many), null);



export { Id, $Pool, Pool, $Post, Post, $Tag, Tag, $User, User };

type __defaultExports = {
  "Id": typeof Id;
  "Pool": typeof Pool;
  "Post": typeof Post;
  "Tag": typeof Tag;
  "User": typeof User
};
const __defaultExports: __defaultExports = {
  "Id": Id,
  "Pool": Pool,
  "Post": Post,
  "Tag": Tag,
  "User": User
};
export default __defaultExports;
