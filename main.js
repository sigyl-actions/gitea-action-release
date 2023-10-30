const core = require('@actions/core');
const github = require('@actions/github');

const { giteaApi } = require("gitea-js");
const fetch = require('cross-fetch');

async function run() {
  try {    

    const api = new giteaApi(
      core.getInput('serverUrl')
        || (github.context.runId && github.context.serverUrl)
        || 'https://gitea.com',
      {
        token: core.getInput('token'),
        customFetch: fetch,
      },
    );
    
    const [owner, repo] = (
      core.getInput('repository')
        || github.context.repository
    ).split("/");
    await api.repos.repoCreateRelease(
      owner,
      repo,
      {
        tag_name: core.getInput('tag'),
        name: core.getInput('title'),
        target_commitish: core.getInput('target') || github.sha,
        body: core.getInput('note'),
      }
    )
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
