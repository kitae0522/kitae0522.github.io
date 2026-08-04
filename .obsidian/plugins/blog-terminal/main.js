const { spawn } = require('node:child_process');
const { Notice, Plugin } = require('obsidian');

module.exports = class BlogTerminalPlugin extends Plugin {
  onload() {
    this.addCommand({
      id: 'open-blog-terminal',
      name: '블로그 터미널 열기',
      callback: () => this.openTerminal(),
    });
  }

  openTerminal() {
    if (process.platform !== 'darwin') {
      new Notice('이 명령은 macOS Terminal에서만 사용할 수 있습니다.');
      return;
    }

    const vaultPath = this.app.vault.adapter?.getBasePath?.();
    if (!vaultPath) {
      new Notice('블로그 Vault 경로를 찾지 못했습니다.');
      return;
    }

    const terminal = spawn('open', ['-a', 'Terminal', vaultPath], {
      detached: true,
      stdio: 'ignore',
    });
    terminal.once('error', () => new Notice('Terminal을 열지 못했습니다.'));
    terminal.unref();
    new Notice('블로그 폴더에서 Terminal을 열었습니다.');
  }
};
