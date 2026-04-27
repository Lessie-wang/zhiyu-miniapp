/**
 * 轻量级 Markdown 转 HTML 工具
 * 专为微信小程序 rich-text 组件设计
 * 支持：加粗、斜体、表格、有序/无序列表、换行
 */

// 基础样式
const styles = {
  table: 'width:100%;border-collapse:collapse;margin:16rpx 0;font-size:26rpx;',
  th: 'border:1rpx solid #D4B8A5;padding:12rpx 16rpx;text-align:left;font-weight:600;background:#F2E6DF;color:#6D6A65;',
  td: 'border:1rpx solid #D4B8A5;padding:12rpx 16rpx;color:#6D6A65;',
  ul: 'margin:8rpx 0;padding-left:32rpx;',
  ol: 'margin:8rpx 0;padding-left:32rpx;',
  li: 'margin:4rpx 0;color:#6D6A65;line-height:1.6;',
  strong: 'font-weight:700;',
  em: 'font-style:italic;',
};

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// 处理行内格式（加粗、斜体）
function processInline(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong style="' + styles.strong + '">$1</strong>')
    .replace(/__(.+?)__/g, '<strong style="' + styles.strong + '">$1</strong>')
    .replace(/(?<!\*)\*(?!\*)(.+?)\*(?!\*)/g, '<em style="' + styles.em + '">$1</em>')
    .replace(/(?<!_)_(?!_)(.+?)_(?!_)/g, '<em style="' + styles.em + '">$1</em>');
}

// 判断是否是表格行
function isTableRow(line) {
  var trimmed = line.trim();
  return trimmed.indexOf('|') !== -1 && trimmed.charAt(0) === '|';
}

// 判断是否是分隔符行
function isSeparatorRow(line) {
  return /^\|[\s\-:|]+\|$/.test(line.trim());
}

// 解析表格行的单元格
function parseCells(line) {
  var cells = line.split('|');
  // 去掉首尾空元素
  if (cells.length > 0 && cells[0].trim() === '') cells.shift();
  if (cells.length > 0 && cells[cells.length - 1].trim() === '') cells.pop();
  return cells.map(function(c) { return c.trim(); });
}

// 渲染表格
function renderTable(tableLines) {
  var headerLine = tableLines[0];
  var hasSep = tableLines.length > 1 && isSeparatorRow(tableLines[1]);
  var bodyStart = hasSep ? 2 : 1;

  var html = '<table style="' + styles.table + '"><tbody>';

  // 表头
  var headerCells = parseCells(headerLine);
  html += '<tr>';
  headerCells.forEach(function(cell) {
    html += '<th style="' + styles.th + '">' + processInline(escapeHtml(cell)) + '</th>';
  });
  html += '</tr>';

  // 表体
  for (var i = bodyStart; i < tableLines.length; i++) {
    if (isSeparatorRow(tableLines[i])) continue;
    var cells = parseCells(tableLines[i]);
    if (cells.length === 0) continue;
    html += '<tr>';
    cells.forEach(function(cell) {
      html += '<td style="' + styles.td + '">' + processInline(escapeHtml(cell)) + '</td>';
    });
    html += '</tr>';
  }

  html += '</tbody></table>';
  return html;
}

/**
 * 将 Markdown 文本转换为 HTML
 * @param {string} text - Markdown 文本
 * @returns {string} HTML 字符串，可直接用于 rich-text 的 nodes
 */
function toHtml(text) {
  if (!text) return '';

  var lines = text.split('\n');
  var result = [];
  var i = 0;

  while (i < lines.length) {
    var line = lines[i];
    var trimmed = line.trim();

    // 空行 — 跳过，不额外插入换行（段间距靠 join 的 br 即可）
    if (trimmed === '') {
      i++;
      continue;
    }

    // 表格：收集连续的表格行
    if (isTableRow(line)) {
      var tableLines = [];
      while (i < lines.length && isTableRow(lines[i])) {
        tableLines.push(lines[i]);
        i++;
      }
      result.push(renderTable(tableLines));
      continue;
    }

    // 无序列表
    var ulMatch = trimmed.match(/^[\-\*]\s+(.+)$/);
    if (ulMatch) {
      var items = [];
      while (i < lines.length) {
        var m = lines[i].trim().match(/^[\-\*]\s+(.+)$/);
        if (!m) break;
        items.push(m[1]);
        i++;
      }
      var ul = '<ul style="' + styles.ul + '">';
      items.forEach(function(item) {
        ul += '<li style="' + styles.li + '">' + processInline(escapeHtml(item)) + '</li>';
      });
      ul += '</ul>';
      result.push(ul);
      continue;
    }

    // 有序列表
    var olMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (olMatch) {
      var olItems = [];
      while (i < lines.length) {
        var om = lines[i].trim().match(/^\d+\.\s+(.+)$/);
        if (!om) break;
        olItems.push(om[1]);
        i++;
      }
      var ol = '<ol style="' + styles.ol + '">';
      olItems.forEach(function(item) {
        ol += '<li style="' + styles.li + '">' + processInline(escapeHtml(item)) + '</li>';
      });
      ol += '</ol>';
      result.push(ol);
      continue;
    }

    // 普通文本行
    result.push(processInline(escapeHtml(trimmed)));
    i++;
  }

  return result.join('<br/>');
}

module.exports = {
  toHtml: toHtml
};
