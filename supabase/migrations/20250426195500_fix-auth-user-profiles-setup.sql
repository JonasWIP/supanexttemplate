-- Step 0: Drop the trigger BEFORE dropping the function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 1: Drop the old function
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Step 2: Recreate the updated handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  username_val TEXT;
  fullname_val TEXT;
  avatar_val TEXT;
BEGIN
  username_val := COALESCE(
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'name',
    NEW.raw_app_meta_data->>'username',
    split_part(NEW.email, '@', 1)
  );

  fullname_val := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    username_val
  );

  avatar_val := COALESCE(
    NEW.raw_user_meta_data->>'avatar_url',
    'https://ui-avatars.com/api/?name=' || replace(fullname_val, ' ', '+') || '&background=random&color=fff&size=256'
  );

  INSERT INTO public.user_profiles (
    id,
    username,
    full_name,
    avatar_url,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    username_val,
    fullname_val,
    avatar_val,
    NOW(),
    NOW()
  );

  RETURN NEW;
END;
$function$;

COMMENT ON FUNCTION public.handle_new_user() IS 'Creates a user profile after a new user is registered';

-- Step 3: Recreate the trigger
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
