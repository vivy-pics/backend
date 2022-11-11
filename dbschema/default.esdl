module default {
	scalar type Id extending sequence;

	# A post on the board
	type Post {
		# the prettified number that gets shown in URLs
		property number -> Id {
			constraint exclusive;
		}

		# whether or not the post is soft-deleted (the post doesn't get indexed in search but can still be accessed via direct link)
		required property soft_deleted -> bool {
			default := false;
		}

		# the hash of the file to use
		required property hash -> str {
			# after a post is submitted, its containing file cannot be changed or updated.
			# to change this, the post itself would have to be deleted and a new one created, which would subsequently delete the file
			# from storage too.
			readonly := true;
		}

		# when this post was created
		required property posted_at -> datetime {
			# assigned once
			readonly := true;
			default := datetime_current();
		}

		# the number of likes this post has
		required property likes -> int32 {
			default := 0;
			constraint min_value(0);
		}

		# whether or not the post is NSFW
		required property nsfw -> bool {
			default := false;
		}

		# assigned when the post is (soft-)deleted
		property deleted_at -> datetime;
		# a deletion region - shows when the post is soft deleted
		property deletion_reason -> str;

		# posts are owned by a user
		required link owner -> User;

		# posts can be variants of other posts
		link variant_of -> Post;
	}

	# A 'pool' (collection) of posts
	type Pool {
		# the prettified number that gets shown in URLs
		property number -> Id {
			constraint exclusive;
		}

		# the display name of the pool
		required property name -> str;

		# who owns the pool
		required link owner -> User;

		# the posts in the pool
		multi link posts -> Post;
	}

	# A user on the board
	type User {
		# the prettified number that gets shown in URLs
		property number -> Id {
			constraint exclusive;
		}

		# their username
		required property username -> str;
		# their e-mail address
		required property email -> str;
		# mainly here for constraints
		required property clean_username := str_lower(.username);

		# their password
		required property password_hash -> str;

		# whether or not they're a moderator
		required property is_moderator -> bool {
			default := false;
		}

		# whether or not the user is banned from posting, signing in, etc. and freezes their account information
		required property banned -> bool {
			default := false;
		}

		# the last used IP address of the user
		property last_used_ip -> str;

		# enforces unique usernames
		constraint exclusive on (.clean_username);
	}

	type Tag {
		# the name of the tag
		required property name -> str {
			constraint exclusive;
		}

		# whether or not this tag should stay after all of its posts are gone - this is used for metadata tags
		required property persistent -> bool {
			default := false;
		}

		# the posts with this tag
		multi link posts -> Post;
	}
}
