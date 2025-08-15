import axios from 'axios';
import { config } from 'dotenv';
import fsExtra from 'fs-extra';
import { join } from 'path';
import { existsSync, readdirSync, unlinkSync } from 'fs';

function toComponentName(name) {
  return name
    .replace(/[^a-zA-Z0-9]+/g, ' ') // 非字母数字变空格
    .trim()
    .split(/\s+/)                   // 按空格分割
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');                      // 拼成驼峰
}

const { writeFile, ensureDir } = fsExtra;

config();

// const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FIGMA_TOKEN = 'figd_MD5JsFt4JJcYVZ6uBM16t8c2YP-ONVCyfmcpp5XU';
const FIGMA_FILE_ID = 'rJdzdR55Y5klSQ07yoUvLK'; // 硬编码的文件 ID
const FRAME_NODE_ID = '2:2'; // 硬编码的 Frame 节点 ID
const OUTPUT_DIR = join(process.cwd(), 'src/svgs');

// 清理svgs目录中的文件
function cleanSvgsDirectory() {
  if (existsSync(OUTPUT_DIR)) {
    const files = readdirSync(OUTPUT_DIR);
    for (const file of files) {
      if (file.endsWith('.svg')) {
        const filePath = join(OUTPUT_DIR, file);
        unlinkSync(filePath);
        console.log(`Deleted: ${file}`);
      }
    }
    console.log(`Cleaned ${files.filter(f => f.endsWith('.svg')).length} SVG files from ${OUTPUT_DIR}`);
  } else {
    console.log(`SVGs directory ${OUTPUT_DIR} does not exist, will be created.`);
  }
}

if (!FIGMA_TOKEN) {
  console.error('Missing FIGMA_TOKEN in .env file');
  process.exit(1);
}

const figmaClient = axios.create({
  baseURL: 'https://api.figma.com/v1',
  headers: {
    'X-Figma-Token': FIGMA_TOKEN,
  },
});

// 获取指定节点的详细信息，包括子节点
async function getFigmaNodes(fileId, nodeId) {
  try {
    const response = await figmaClient.get(`/files/${fileId}/nodes?ids=${nodeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Figma nodes:', error.response?.data || error.message);
    throw error;
  }
}

// 递归获取所有子节点 ID
function getAllChildNodeIds(node) {
  const nodeIds = [];

  if (node.children && node.children.length > 0) {
    for (const child of node.children) {
      // 只收集可导出的节点类型
      nodeIds.push(child.id);
    }
  }

  return nodeIds;
}

async function getComponentSvgs(fileId, componentIds) {
  const response = await figmaClient.get(
    `/images/${fileId}?ids=${componentIds.join(',')}&format=svg`
  );
  return response.data.images;
}

async function syncFigma() {
  console.log('Starting Figma sync...');
  console.log("🚀 ~ syncFigma ~ fileId:", FIGMA_FILE_ID);
  console.log("🚀 ~ syncFigma ~ frameNodeId:", FRAME_NODE_ID);

  // 先清理svgs目录
  console.log('Cleaning existing SVG files...');
  cleanSvgsDirectory();

  console.log(`Fetching Frame node ${FRAME_NODE_ID} and its children...`);

  // 获取指定 Frame 节点的详细信息
  const nodesData = await getFigmaNodes(FIGMA_FILE_ID, FRAME_NODE_ID);
  console.log("🚀 ~ syncFigma ~ nodesData:", nodesData)
  const frameNode = nodesData.nodes[FRAME_NODE_ID]?.document;

  if (!frameNode) {
    console.error(`Frame node ${FRAME_NODE_ID} not found.`);
    process.exit(1);
  }

  console.log(`Found Frame: ${frameNode.name}`);

  // 获取所有子节点 ID
  const childNodeIds = getAllChildNodeIds(frameNode);

  if (childNodeIds.length === 0) {
    console.log('No child nodes found in the Frame.');
    return;
  }

  console.log(`Found ${childNodeIds.length} child nodes to export`);

  // 批量获取 SVG URLs
  const imageUrls = await getComponentSvgs(FIGMA_FILE_ID, childNodeIds);

  await ensureDir(OUTPUT_DIR);

  // 获取子节点的详细信息以获取名称
  const childNodesData = await getFigmaNodes(FIGMA_FILE_ID, childNodeIds.join(','));

  for (const nodeId of childNodeIds) {
    const imageUrl = imageUrls[nodeId];
    if (!imageUrl) {
      console.log(`No SVG URL for node ${nodeId}, skipping...`);
      continue;
    }

    try {
      const svgContent = await axios.get(imageUrl, { responseType: 'text' });

      // 获取节点名称
      const nodeInfo = childNodesData.nodes[nodeId]?.document;
      const nodeName = nodeInfo?.name || nodeId;
      const fileName = toComponentName(nodeName); // 清理文件名中的无效字符
      const filePath = join(OUTPUT_DIR, `${fileName}.svg`);

      await writeFile(filePath, svgContent.data);
      console.log(`Synced ${fileName}.svg`);
    } catch (error) {
      console.error(`Failed to download SVG for ${nodeId}:`, error.message);
    }
  }

  console.log('Figma sync completed.');
}

syncFigma().catch((error) => {
  console.error(error);
  process.exit(1);
});
