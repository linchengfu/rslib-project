// Vercel Serverless Function for Figma sync
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 验证 webhook secret 或 API key
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${process.env.API_SECRET}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // 这里可以调用你的同步逻辑
    // 但需要注意 Vercel Functions 有执行时间限制（10秒免费版，60秒Pro版）

    // 触发 GitHub Actions 或直接执行同步
    const response = await fetch('https://api.github.com/repos/linchengfu/rslib-project/dispatches', {
      method: 'POST',
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_type: 'sync-figma',
        client_payload: {
          sync_figma: true,
          publish_npm: true,
          deploy_pages: true
        }
      })
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    res.status(200).json({
      success: true,
      message: 'Figma sync triggered successfully'
    });

  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}