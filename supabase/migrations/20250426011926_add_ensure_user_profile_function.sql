

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."ensure_user_profile"("user_id" "uuid", "user_username" "text", "user_avatar_url" "text" DEFAULT NULL::"text", "user_full_name" "text" DEFAULT NULL::"text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  generated_full_name TEXT;
  generated_avatar_url TEXT;
BEGIN
  -- Generate full name if not provided
  generated_full_name := COALESCE(
    user_full_name,
    user_username
  );

  -- Generate avatar URL if not provided
  generated_avatar_url := COALESCE(
    user_avatar_url,
    'https://ui-avatars.com/api/?name=' || replace(generated_full_name, ' ', '+') || 
    '&background=random&color=fff&size=256'
  );

  -- Check if user profile exists
  IF NOT EXISTS (
    SELECT 1 FROM public.user_profiles WHERE id = user_id
  ) THEN
    -- Create new profile if doesn't exist
    INSERT INTO public.user_profiles (
      id,
      username,
      full_name,
      avatar_url,
      created_at,
      updated_at
    ) VALUES (
      user_id,
      user_username,
      generated_full_name,
      generated_avatar_url,
      NOW(),
      NOW()
    );
  ELSE
    -- Update existing profile if missing fields
    UPDATE public.user_profiles
    SET 
      username = COALESCE(public.user_profiles.username, user_username),
      full_name = COALESCE(public.user_profiles.full_name, generated_full_name),
      avatar_url = COALESCE(public.user_profiles.avatar_url, generated_avatar_url),
      updated_at = NOW()
    WHERE 
      id = user_id AND
      (public.user_profiles.username IS NULL OR 
       public.user_profiles.full_name IS NULL OR 
       public.user_profiles.avatar_url IS NULL);
  END IF;
END;
$$;


ALTER FUNCTION "public"."ensure_user_profile"("user_id" "uuid", "user_username" "text", "user_avatar_url" "text", "user_full_name" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."ensure_user_profile"("user_id" "uuid", "user_username" "text", "user_avatar_url" "text", "user_full_name" "text") IS 'Ensures a user profile exists with auto-generated full name and avatar';



CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  username_val TEXT;
  fullname_val TEXT;
  avatar_val TEXT;
BEGIN
  BEGIN
    -- Extract username from metadata or email
    username_val := COALESCE(
      NEW.raw_user_meta_data->>'username',
      NEW.raw_user_meta_data->>'name',
      NEW.raw_app_meta_data->>'username',
      split_part(NEW.email, '@', 1)
    );
    
    -- Generate a full name if not provided in metadata
    fullname_val := COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      username_val
    );
    
    -- Generate an avatar URL using UI Avatars API based on the username or email
    -- This creates a colored avatar with the user's initials
    avatar_val := COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      'https://ui-avatars.com/api/?name=' || replace(fullname_val, ' ', '+') || 
      '&background=random&color=fff&size=256'
    );
    
    INSERT INTO public.user_profiles (
      id, 
      username,
      full_name,
      avatar_url
    )
    VALUES (
      NEW.id,
      username_val,
      fullname_val,
      avatar_val
    );
  EXCEPTION WHEN OTHERS THEN
    -- Log error but don't fail the transaction
    RAISE NOTICE 'Failed to create profile for user % - %', NEW.id, SQLERRM;
  END;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."handle_new_user"() IS 'Creates a user profile upon user creation with auto-generated full name and avatar';



CREATE OR REPLACE FUNCTION "public"."handle_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."user_profiles" (
    "id" "uuid" NOT NULL,
    "username" "text",
    "full_name" "text",
    "avatar_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_profiles" OWNER TO "postgres";


COMMENT ON TABLE "public"."user_profiles" IS 'Profiles for authenticated users';



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_username_key" UNIQUE ("username");



CREATE OR REPLACE TRIGGER "update_user_profiles_updated_at" BEFORE UPDATE ON "public"."user_profiles" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Profiles are viewable by everyone" ON "public"."user_profiles" FOR SELECT USING (true);



CREATE POLICY "Service role can insert profiles" ON "public"."user_profiles" FOR INSERT TO "authenticated", "anon" WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Service role can manage all profiles" ON "public"."user_profiles" USING ((("auth"."jwt"() ->> 'role'::"text") = 'service_role'::"text"));



CREATE POLICY "Users can read own profile" ON "public"."user_profiles" FOR SELECT USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can update own profile" ON "public"."user_profiles" FOR UPDATE USING (("auth"."uid"() = "id"));



ALTER TABLE "public"."user_profiles" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";





GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

















































































































































































GRANT ALL ON FUNCTION "public"."ensure_user_profile"("user_id" "uuid", "user_username" "text", "user_avatar_url" "text", "user_full_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."ensure_user_profile"("user_id" "uuid", "user_username" "text", "user_avatar_url" "text", "user_full_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ensure_user_profile"("user_id" "uuid", "user_username" "text", "user_avatar_url" "text", "user_full_name" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "service_role";


















GRANT ALL ON TABLE "public"."user_profiles" TO "anon";
GRANT ALL ON TABLE "public"."user_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."user_profiles" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;

--
-- Dumped schema changes for auth and storage
--

CREATE OR REPLACE TRIGGER "on_auth_user_created" AFTER INSERT ON "auth"."users" FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_user"();



