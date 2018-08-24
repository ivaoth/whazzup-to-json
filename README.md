ivaowhazzup-to-json
===================

Converting IVAO Whazzup text file into JSON format using NodeJS

Requirements
------------

- Node v.8.11.4+

Configuration
-------------

| Name               | Description                  | Required |
|--------------------|------------------------------|----------|
| general.baseurl    | Base URL to site             | yes      |
| general.whazzupurl | IVAO Whazzup status file URL | yes      |
| web.port           | Expose port                  | yes      |

Installation
------------

01. Clone repository

    ```markdown
    $ git clone https://github.com/rayriffy/ivaowhazzup-to-json
    Cloning into 'ivaowhazzup-to-json'...
    remote: Counting objects: 71, done.
    remote: Compressing objects: 100% (14/14), done.
    remote: Total 71 (delta 5), reused 16 (delta 3), pack-reused 51
    Unpacking objects: 100% (71/71), done.
    ```

02. Install Packages

    ```markdown
    $ yarn
    yarn install v1.9.4
    info No lockfile found.
    [1/4] Resolving packages...
    [2/4] Fetching packages...
    [3/4] Linking dependencies...
    [4/4] Building fresh packages...

    success Saved lockfile.
    Done in 0.12s.
    ```

03. Run it!

    ```mardown
    $ yarn start
    yarn run v1.9.4
    ```

Routes
------

| Method | URI                                                          | Description                |
|--------|--------------------------------------------------------------|----------------------------|
| GET    | [/status](https://whazzup.rayriffy.com/status)     | Show whazzup status file   |
| GET    | [/whazzup](https://whazzup.rayriffy.com/whazzup)   | Show IVAO traffic and ATCs |
| GET    | [/metar](https://whazzup.rayriffy.com/metar)       | Show METAR information     |
| GET    | [/taf](https://whazzup.rayriffy.com/taf)           | Show TAF information       |
| GET    | [/shorttaf](https://whazzup.rayriffy.com/shorttaf) | Show short TAF information |