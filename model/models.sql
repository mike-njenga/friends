profiles
id (uuid, PK, references auth.users.id)
email (text)
role (text) -- 'admin' | 'user'
created_at

friends

id (uuid, PK)
name (text)
email (text)
phone (text)
created_at
updated_at
