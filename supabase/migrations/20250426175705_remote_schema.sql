drop policy "Profiles are viewable by everyone" on "public"."user_profiles";

drop policy "Service role can insert profiles" on "public"."user_profiles";

drop function if exists "public"."ensure_user_profile"(user_id uuid, user_username text, user_avatar_url text, user_full_name text);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    INSERT INTO public.user_profiles (id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$
;


