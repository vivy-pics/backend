CREATE MIGRATION m15zari5qmrav5zaraezcoce2eb244addsb3x47zmzclok2jqyubaa
    ONTO m1rqosrs3zjeocqpzrctkvs5ljrn6shch52lrw75ppue2s2tuk7kaa
{
  ALTER TYPE default::User {
      CREATE REQUIRED PROPERTY clean_email := (std::str_lower(.email));
      CREATE CONSTRAINT std::exclusive ON (.clean_email);
      ALTER PROPERTY username {
          CREATE CONSTRAINT std::max_len_value(32);
      };
  };
};
