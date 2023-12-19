# SCINTILLA Science Club Official WebSite

Behind the scene of official website of the first ever science club of Bangladesh, Scintilla.

## Run Locally

First, clone the project:

```bash
  git clone https://github.com/mr-m1m3/scintilla
```

Go to the project directory

```bash
  cd scintilla
```

Install dependencies

```bash
  yarn
```

Execute pocketbase instance

```bash
  chmod +x ./src/backend/pocketbase
  ./src/backend/pocketbase
```

#### Setup pocketbase

Open up your browser and visit pocketbase admi dashboard.    (Typiclaly On  `http://localhost:8090/_`). If you are first to visit after executing the binary, you will be asked to create an admin account. After, creating admin account, do the following:

1. Create a collection named `general_members` with the following properties with described settings:

- **name**: nonempty plain text with the max length of 24 characters.
- **class**: nonzero nodecimal number with minimum value of 3 and maximum value of 12.
- **section**: nonepmpty plain text with min length of 3 and max length of 12
- **roll**: nonzero no decimal number with min value of 1
- **contact_self**: nonempty plain text with min and max length of 11 and regex pattern set to: `^(\+?8801|01)(1|3|4|5|6|7|8|9)(\d){8}$`
- **contact_parent**: nonempty plain text with min and max length of 11 and regex pattern set to: `^(\+?8801|01)(1|3|4|5|6|7|8|9)(\d){8}$`
- **Set** API view rule to `@request.auth.id = @collection.general_members.id`
- **Set** API create rule to empty (grant everyone)
- **Set** API view rule to `@request.auth.id = @collection.general_members.id`
- **Set** API delete rule to Admins Only
- **Turn off** authentication with `username and password` and `email and password`. Only allow authentication via `oauth`.
- Setup Google oauth.

2. Create a collection named `events` with the following properties with described settings:

- **name**: Non empty plain text
- **description** Plain text
- **type**: Only one selectable of two options: `solo` and `group`
- **rules**: Non-empty rich text.
- **submission_deadline**: Non-empty UTC date
- **registration_url**: Non-empty URL
- **Set** list and view rule to empty (grant everyone access)
- **Set** create, update and delete rules to admins only

#### Setup environment variables

On the root of the project, create a file named `.env` and set the following property to their appropriate value.

```env
CONFIGURED_POCKETBASE_URL="URL_TO_THE_POCKETBASE_INSTANCE_YOU_JUST_SETUP"
GOOGLE_OAUTH_REDIRECTED_DOMAIN="AS_THE_NAME_SUGGESTS"

```

Now, we are good to go. Run:

```bash
yarn build
yarn preview
```

## Authors

- [@mr-m1m3](https://www.github.com/mr-m1m3)
