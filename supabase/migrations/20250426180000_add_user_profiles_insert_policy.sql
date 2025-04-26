-- Add user profiles insert policy
CREATE POLICY "Allow insert for authenticated users on user_profiles"
ON public.user_profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

COMMENT ON POLICY "Allow insert for authenticated users on user_profiles" ON public.user_profiles
IS 'Allows authenticated users to insert their own user profile';