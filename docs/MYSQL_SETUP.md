# MySQL Setup Guide

## Current Configuration

Your `.env` file is configured with:
```
DATABASE_URL="mysql://root:maniora@localhost:3306/maniorainstagramautomation"
```

## Setup Steps

### 1. Verify MySQL is Running

**Windows:**
```powershell
# Check if MySQL service is running
Get-Service -Name MySQL*

# Or check if MySQL is listening on port 3306
netstat -an | findstr :3306
```

**Manual Check:**
- Open MySQL Workbench or command line
- Try connecting with:
  - Host: `localhost`
  - Port: `3306`
  - Username: `root`
  - Password: `maniora`

### 2. Create Database (if it doesn't exist)

Connect to MySQL and run:
```sql
CREATE DATABASE IF NOT EXISTS maniorainstagramautomation;
```

Or via command line:
```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS maniorainstagramautomation;"
```

### 3. Test Database Connection

Run the test script:
```bash
npm run db:test
```

This will verify:
- ✅ Database connection
- ✅ Credentials are correct
- ✅ Database exists
- ✅ Can execute queries

### 4. Generate Prisma Client

**Important:** Stop your dev server first, then run:
```bash
npm run db:generate
```

This generates the Prisma client with the updated schema (password field is now optional).

### 5. Run Database Migrations

Create and apply the database schema:
```bash
npm run db:migrate
```

This will:
- Create all tables (User, Tenant, Subscription, etc.)
- Set up relationships and indexes
- Apply the schema to your MySQL database

### 6. (Optional) Seed Database

Add initial data:
```bash
npm run db:seed
```

### 7. Verify Setup

After completing the above steps, test the connection again:
```bash
npm run db:test
```

You should see:
- ✅ Database connection successful!
- ✅ Database query test successful!
- ✅ Database tables: [list of tables]

## Troubleshooting

### Error: "Authentication failed"
- **Solution:** Verify the MySQL root password is `maniora`
- Update `.env` if your password is different

### Error: "Database does not exist"
- **Solution:** Create the database (see step 2)

### Error: "Can't connect to MySQL server"
- **Solution:** 
  1. Check if MySQL service is running
  2. Verify port 3306 is not blocked by firewall
  3. Check MySQL is listening on localhost

### Error: "Access denied for user"
- **Solution:** 
  1. Verify username is `root`
  2. Verify password is correct
  3. Check user has permissions to create databases

## DATABASE_URL Format

The format for MySQL is:
```
mysql://[username]:[password]@[host]:[port]/[database_name]
```

Your current format is correct:
```
mysql://root:maniora@localhost:3306/maniorainstagramautomation
```

## Next Steps

After setup is complete:
1. ✅ Database connection works
2. ✅ Prisma client generated
3. ✅ Migrations applied
4. ✅ OAuth login should work

Try Google OAuth login again - it should work now!

