CREATE MIGRATION m1rqosrs3zjeocqpzrctkvs5ljrn6shch52lrw75ppue2s2tuk7kaa
    ONTO m1uoktcfkqxdbq2rw4lchr5a6j3ou4rnf537zmzd7iwvi3kawazvfq
{
  ALTER TYPE default::Post {
      CREATE REQUIRED PROPERTY approved -> std::bool {
          SET default := false;
      };
  };
  ALTER TYPE default::User {
      ALTER PROPERTY is_moderator {
          RENAME TO moderator;
      };
  };
  ALTER TYPE default::User {
      CREATE REQUIRED PROPERTY verified -> std::bool {
          SET default := false;
      };
  };
};
