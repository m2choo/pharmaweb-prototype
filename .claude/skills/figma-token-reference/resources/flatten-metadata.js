#!/usr/bin/env node
// get_metadata 결과가 너무 커서 파일로 저장되면, JSON 배열([{type,text}]) 안의 text 필드에
// 실제 개행이 \n으로 escape되어 들어있다. grep이 전체를 한 줄로 인식해버려서 구조를 못 찾는다.
// 이 스크립트는 그 JSON을 읽어 text를 이어붙이고 실제 줄바꿈으로 풀어써서,
// 이후 grep/Read로 구조(노드 이름, id)를 정상적으로 탐색할 수 있게 한다.
//
// 사용법: node flatten-metadata.js <입력 JSON 파일 경로> <출력 파일 경로>

const fs = require('fs');

const [, , inputPath, outputPath] = process.argv;

if (!inputPath || !outputPath) {
  console.error('사용법: node flatten-metadata.js <입력 JSON 파일> <출력 파일>');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const text = data.map((d) => d.text).join('\n');
fs.writeFileSync(outputPath, text);

console.error(`풀어쓴 결과를 ${outputPath} 에 저장했습니다 (${text.split('\n').length}줄).`);
