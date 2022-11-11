CREATE MIGRATION m1eby4g7ls2bify42eqg6pbl2djata3sl4edwghygu4bog4rriqctq
    ONTO initial
{
  CREATE SCALAR TYPE default::Id EXTENDING std::sequence;
  CREATE TYPE default::Pool {
      CREATE REQUIRED PROPERTY name -> std::str;
      CREATE PROPERTY number -> default::Id {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  CREATE TYPE default::User {
      CREATE REQUIRED PROPERTY username -> std::str;
      CREATE REQUIRED PROPERTY clean_username := (std::str_lower(.username));
      CREATE CONSTRAINT std::exclusive ON (.clean_username);
      CREATE REQUIRED PROPERTY banned -> std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY email -> std::str;
      CREATE REQUIRED PROPERTY is_moderator -> std::bool {
          SET default := false;
      };
      CREATE PROPERTY last_used_ip -> std::str;
      CREATE PROPERTY number -> default::Id {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY password_hash -> std::str;
  };
  ALTER TYPE default::Pool {
      CREATE REQUIRED LINK owner -> default::User;
  };
  CREATE TYPE default::Post {
      CREATE REQUIRED LINK owner -> default::User;
      CREATE LINK variant_of -> default::Post;
      CREATE PROPERTY deleted_at -> std::datetime;
      CREATE PROPERTY deletion_reason -> std::str;
      CREATE REQUIRED PROPERTY hash -> std::str {
          SET readonly := true;
      };
      CREATE REQUIRED PROPERTY likes -> std::int32 {
          SET default := 0;
          CREATE CONSTRAINT std::min_value(0);
      };
      CREATE PROPERTY number -> default::Id {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY posted_at -> std::datetime {
          SET default := (std::datetime_current());
          SET readonly := true;
      };
      CREATE REQUIRED PROPERTY soft_deleted -> std::bool {
          SET default := false;
      };
  };
  ALTER TYPE default::Pool {
      CREATE MULTI LINK posts -> default::Post;
  };
  CREATE TYPE default::Tag {
      CREATE MULTI LINK posts -> default::Post;
      CREATE REQUIRED PROPERTY name -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY persistent -> std::bool {
          SET default := false;
      };
  };
};
