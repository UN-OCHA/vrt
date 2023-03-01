# OCHA VRT

Visual regression testing for different scenarios, with or without Docker.
Useful for testing local sites against a dev or staging site, or testing a
staging site against production before or
after deployment.

Remember to add the HTTP auth credentials for relevant sites:
`TEST_URI=https://user:pw@feature.commondesign-unocha-org.ahconu.org`

## Running via updates scripts.

This has been adapted to run using the scripts in https://github.com/UN-OCHA/drupal-updates. Those scripts may need some small tweaks to work with MacOS and Windows.

## Set up

- An example file for ENV variables `example.env` - Copy and rename to `.env`.
- A txt file for the URLs to test `config/urls_name-of-test.txt`
- A json file with BackstopJS configuration like viewports, scenarios, and
debugging `backstop_name-of-test.json`
- A js file for the test `test_name-of-test.js`
- A directory for custom scripts `library/engine_scripts/` to run on ready. See
https://github.com/garris/BackstopJS#running-custom-scripts
- A node script in package.json for each `reference` and `test` command

## Testing a list of URLs

Screenshots of multiple viewports from a list of public URLs.

```
REF_URI=full URL for reference files
TEST_URI=full URL for test files
```

See [tools-vrt/backstop_anon.json](https://github.com/UN-OCHA/tools-vrt/blob/main/backstop_anon.json)
for default config.

## Testing click and hover behaviour

Screenshots of multiple viewports of click and hover events based on selectors.
Defaults to Common Design header UI
elements - Search, OCHA Services, Main menu parent items, and Mobile menu.
If any of these components are missing, the tests will fail. If there are no
second level menu items, that test will
fail. On desktop viewport, the Mobile menu test will fail. The screenshot will
not be generated and likely a timeout
error Eg. `ENGINE ERROR: waiting for selector `.cd-nav\_\_btn` failed: timeout 30000ms exceeded`.

```
REF_URI=full URL for reference files
TEST_URI=full URL for test files
```

See [tools-vrt/backstop_ui.json](https://github.com/UN-OCHA/tools-vrt/blob/main/backstop_ui.json)
for default config or to
add other elements.
Eg.

```
"scenarios": [
    {
      "clickSelector": ".cd-search__btn"
    },
```

If using the [click or hover interactions](https://github.com/garris/BackstopJS/tree/6634b13bd7b0aa9a61697d410f3aa9b3ae96c740#testing-click-and-hover-interactions),
scripts need to be included (Refer to [Backstop examples](https://github.com/garris/BackstopJS/blob/56b046cf9d2d002af7500539d3d9caa3ce81d83a/test/configs/responsiveDemo.json#L16)
for more info). The scripts should be added to `library/engine_scripts/` and
referenced by filename only
Eg. "onReadyScript": "onReady.js", if `"engine_scripts": "library/engine_scripts",`
is defined in the json config.

## Testing authenticated pages

Screenshots of multiple viewports of a list of URLs that require a log in step
to access. Defaults to HID login.
See [library/engine_scripts/login.js](https://github.com/UN-OCHA/tools-vrt/blob/main/library/engine_scripts/login.js)
for default values.

```

REF_URI=full URL for reference files
REF_LOGIN_PAGE=path to login page Eg: '/user/login/hid'
REF_USERNAME_INPUT=username input selector Eg. '#email'
REF_PASSWORD_INPUT=password input selector Eg. '#password'
REF_SUBMIT=submit button selector Eg. '.t-btn--login'
REF_USERNAME=username for reference URL
REF_PASSWORD=password for reference URL

TEST_URI=full URL for test files
TEST_LOGIN_PAGE=path to login page Eg: '/user/login/hid'
TEST_USERNAME_INPUT=username input selector Eg. '#email'
TEST_PASSWORD_INPUT=password input selector Eg. '#password'
TEST_SUBMIT=submit button selector Eg. '.t-btn--login'
TEST_USERNAME=username for test URL
TEST_PASSWORD=password for test URL

```

See [tools-vrt/backstop_auth.json](https://github.com/UN-OCHA/tools-vrt/blob/main/backstop_auth.json)
for default config.

See https://github.com/garris/BackstopJS for config examples.

## Removing images
Screenshots of multiple viewports from a list of public URLs that replaces the
images with purple or cats.

```
REF_URI=full URL for reference files
TEST_URI=full URL for test files
```

See [tools-vrt/backstop_img.json](https://github.com/UN-OCHA/tools-vrt/blob/main/backstop_img.json)
for default config. Swap `purpleImages.js` for `catImages.js` in
`onReadyScript` in the `backstop_img.json` config.

Note: this might be integrated with the other test as it will be helpful when
using VRT to test pre/post deploy.

# Setup using Docker

- Clone this repo
- Build image `docker build --tag public.ecr.aws/unocha/vrt:main --file docker/Dockerfile .`
- `mkdir -p config data`
- Add URLs to `config/urls_anon.txt` or `config/urls_auth.txt`, hostname does
not really matter
- Load env variables in terminal
- Make any configuration adjustments
- Run the docker commands with the env variables if relevant (Eg. Authenticated
user login credentials) to generate the
reference and test screenshots
- Visit `tools-vrt/data/anon/html_report/index.html` for report

## Run tests

### Generate reference screenshots

```

docker run \
   --shm-size 512m \
   --rm \
   --net="host" \
   --name reference \
   --entrypoint npm \
   -e REF_URI=${REF_URI} \
   -v "$(pwd)/data:/srv/data" \
   -v "$(pwd)/config:/srv/config" \
   -w /srv \
   public.ecr.aws/unocha/vrt:main \
   run reference-anon

```

### Generate test screenshots

```

docker run \
   --shm-size 512m \
   --rm \
   --net="host" \
   --name test \
   --entrypoint npm \
   -e TEST_URI=${TEST_URI} \
   -v "$(pwd)/data:/srv/data" \
   -v "$(pwd)/config:/srv/config" \
   -w /srv \
   public.ecr.aws/unocha/vrt:main \
   run test-anon

```

### Generate reference screenshots for authenticated pages

```

docker run \
   --shm-size 512m \
   --rm \
   --net="host" \
   --name reference \
   --entrypoint npm \
   -e REF_URI=${REF_URI} \
   -e REF_USERNAME=${REF_USERNAME} \
   -e REF_PASSWORD=${REF_PASSWORD} \
   -v "$(pwd)/data:/srv/data" \
   -v "$(pwd)/config:/srv/config" \
   -v "$(pwd)/backstop_auth.json:/srv/backstop_auth.json" \
   -w /srv \
   public.ecr.aws/unocha/vrt:main \
   run reference-auth

```

### Generate test screenshots for authenticated pages

```

docker run \
   --shm-size 512m \
   --rm \
   --net="host" \
   --name test \
   --entrypoint npm \
   -e TEST_URI=${TEST_URI} \
   -e TEST_USERNAME=${TEST_USERNAME} \
   -e TEST_PASSWORD=${TEST_PASSWORD} \
   -v "$(pwd)/data:/srv/data" \
   -v "$(pwd)/config:/srv/config" \
   -v "$(pwd)/backstop_auth.json:/srv/backstop_auth.json" \
   -w /srv \
   public.ecr.aws/unocha/vrt:main \
   run test-auth

```

### Generate reference screenshots for UI behaviour

```

docker run \
   --shm-size 512m \
   --rm \
   --net="host" \
   --name reference \
   --entrypoint npm \
   -e REF_URI=${REF_URI} \
   -v "$(pwd)/data:/srv/data" \
   -v "$(pwd)/config:/srv/config" \
   -v "$(pwd)/backstop_ui.json:/srv/backstop_ui.json" \
   -v "$(pwd)/test_ui.js:/srv/test_ui.js" \
   -w /srv \
   public.ecr.aws/unocha/vrt:main \
   run reference-ui

```

### Generate test screenshots for UI behaviour

```

docker run \
   --shm-size 512m \
   --rm \
   --net="host" \
   --name test \
   --entrypoint npm \
   -e TEST_URI=${TEST_URI} \
   -v "$(pwd)/data:/srv/data" \
   -v "$(pwd)/config:/srv/config" \
   -v "$(pwd)/backstop_ui.json:/srv/backstop_ui.json" \
   -v "$(pwd)/test_ui.js:/srv/test_ui.js" \
   -w /srv \
   public.ecr.aws/unocha/vrt:main \
   run test-ui

```

## Troubleshooting

If you run docker locally, explore the image via:
`docker run --rm --name junk --hostname junk -it --entrypoint /bin/bash public.ecr.aws/unocha/vrt:main`

Test custom files locally by mapping the files as extra volumes when you run
docker:

```

-v "$(pwd)/backstop-ui.json:/srv/backstop_ui.json"

```

and include the package.json with the new script commands:

```

-v "$(pwd)/package.json:/srv/package.json" \

```

To delete old images `docker rmi public.ecr.aws/unocha/vrt:main`

If testing a local site results in `Error: net::ERR_NAME_NOT_RESOLVED at [localhost]`
add `--net="host"` to the Docker
command.
Eg.

```

docker run \
 --shm-size 512m \
 --rm \
 --net="host" \
 ...

```

If the docker command fails with `Puppeteer TypeError: text is not iterable`
make sure the variable is available in the
container.

Eg.

```

docker run \
 ...
-e TEST_USERNAME=${TEST_USERNAME} \

```

or

```

docker run \
 ...
-e REF_LOGINPAGE=/user/login/hid \

```

# Setup without Docker

- Clone this repo
- `npm i`
- Add URLs to `config/urls_anon.txt`, hostname does not really matter
- Edit `.env` file. Add the relevant variables to `.env `file and change their
values as needed.

## Run tests

### Generate reference screenshots

`npm run reference-anon`

### Generate test screenshots

`npm run test-anon`

### Generate reference screenshots for authenticated pages

`npm run reference-auth`

### Generate test screenshots for authenticated pages

`npm run test-auth`

### Generate reference screenshots for UI behaviour

`npm run reference-ui`

### Generate test screenshots for UI behaviour

`npm run test-ui`

## Troubleshooting

If there are permission issues with the directories for the screenshots and
reports (Eg. after running via Docker),
remove the folders before running the npm commands.
`sudo rm -R -df data/anon/`

Change `debug` and `debugWindow` to `true` to see the tests run in a local
Chromium instance.
