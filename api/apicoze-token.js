// api/coze-token.js
// Coze Token 代理服务 - Vercel Serverless Function

export default async function handler(req, res) {
  // ========== CORS 设置 ==========
  const allowedOrigins = ['*']; // 上线后改成你的网页域名，如 'https://yourschool.com'
  res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0]);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // 预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // 只允许 POST 和 GET
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // ========== 获取参数 ==========
    const studentId = req.body?.studentId || req.query?.studentId || 'anonymous';
    const classCode = req.body?.classCode || req.query?.classCode || '';
    
    // ========== 从环境变量读取配置（不暴露在代码里）==========
    const COZE_TOKEN = process.env.COZE_TOKEN;
    const CLASS_CODE = process.env.CLASS_CODE; // 可选课堂口令
    
    if (!COZE_TOKEN) {
      console.error('COZE_TOKEN 环境变量未配置');
      return res.status(500).json({ 
        error: '服务器配置错误，请联系管理员' 
      });
    }
    
    // ========== 验证课堂口令（可选）==========
    if (CLASS_CODE && classCode !== CLASS_CODE) {
      return res.status(401).json({ 
        error: '课堂口令错误' 
      });
    }
    
    // ========== 记录访问日志（Vercel控制台可查看）==========
    console.log(`[${new Date().toISOString()}] 学生获取Token: ${studentId}`);
    
    // ========== 返回Token ==========
    return res.status(200).json({
      token: COZE_TOKEN,
      studentId: studentId,
      timestamp: Date.now(),
      success: true
    });
    
  } catch (err) {
    console.error('代理服务异常:', err);
    return res.status(500).json({ 
      error: '服务异常，请稍后重试' 
    });
  }
}