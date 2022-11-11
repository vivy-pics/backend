CREATE MIGRATION m1uoktcfkqxdbq2rw4lchr5a6j3ou4rnf537zmzd7iwvi3kawazvfq
    ONTO m1eby4g7ls2bify42eqg6pbl2djata3sl4edwghygu4bog4rriqctq
{
  ALTER TYPE default::Post {
      CREATE REQUIRED PROPERTY nsfw -> std::bool {
          SET default := false;
      };
  };
};
