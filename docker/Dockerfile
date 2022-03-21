FROM public.ecr.aws/unocha/debian-snap-base:12-debian

ARG VCS_REF
ARG VCS_URL
ARG BUILD_DATE
ARG GITHUB_ACTOR
ARG GITHUB_REPOSITORY
ARG GITHUB_SHA
ARG GITHUB_REF
ARG GITHUB_MESSAGE

ENV  GIT_BLAME=$GITHUB_ACTOR
ENV  GIT_REPO=$GITHUB_REPOSITORY
ENV  GIT_SHA=$GITHUB_SHA
ENV  GIT_REF=$GITHUB_REF
ENV  GIT_MSG=$GITHUB_MESSAGE
LABEL info.humanitarianresponse.build.date=$BUILD_DATE \
      info.humanitarianresponse.build.vcs-url=$VCS_URL \
      info.humanitarianresponse.build.vcs-ref=$VCS_REF \
      info.humanitarianresponse.build.blame=left23 \
      info.humanitarianresponse.build.user=$GITHUB_ACTOR \
      info.humanitarianresponse.build.message=$GITHUB_MESSAGE

# Ensure that puppeteer downloads the chromium version it thinks it needs by
# setting PUPPETEER_SKIP_CHROMIUM_DOWNLOAD to empty.
ENV NODE_ENV=production \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD= \
    REF_URI=http://local.example.com \
    TEST_URI=https://www.example.com

WORKDIR /srv
COPY . .

RUN \
    # Do not leak secrets via docker images.
    rm -rf .env && \
    apt-get -qy update && \
    apt-get -qy dist-upgrade && \
    apt-get -qy install --no-install-recommends bash google-chrome-stable && \
    apt-get -qy install libx11-xcb1 libxtst6 libxss1 libxshmfence1 && \
    apt-get -qy clean && \
    rm -rf /var/cache/apt/lists/* && \
    # Create a symlink to the helper scripts.
    # See https://humanitarian.atlassian.net/browse/OPS-6831
    ln -s /srv/node_modules/backstopjs/capture/engine_scripts/puppet ./scripts

# Install packages.
RUN npm install

# How is datty formed?
VOLUME ["/srv/data"]

# Do not try to run a node server.
ENTRYPOINT ["/bin/bash"]
