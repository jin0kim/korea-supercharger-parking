# 전국 테슬라 슈퍼차저 · 주차정보 지도

전국 167개 테슬라 슈퍼차저를 지도와 리스트로 보여주는 정적 웹사이트입니다.
**무료회차(회차시간) · 이후요금 · 일 최대 · 무료주차 조건**을 중심으로 검색·필터링할 수 있습니다.

## 구성

| 파일 | 설명 |
|------|------|
| `index.html` | 웹페이지 (지도 + 검색 + 필터 + 리스트) |
| `data.js` | 앱이 읽는 데이터 (`window.CHARGERS`) — 로컬에서 바로 열 때 사용 |
| `data.json` | 동일 데이터의 JSON 원본 (DB 역할, 편집용) |
| `vercel.json` | Vercel 배포 설정 |

## 데이터 필드

- `name` 이름 · `region` 지역 · `speed` 충전속도 · `stalls` 스톨 수 · `location` 진입 위치
- `grace_label` 무료회차 표기 · `grace_min` 무료회차(분) · `grace_bucket` 회차 구간
- `fee_after` 이후 요금 · `daily_max` 일 최대 · `free_cond` 무료주차 조건 · `parking` 원본 주차 문구
- `rating` 총평점 · `note` 기타 메모 · `lat`/`lng` 좌표 (`coord_src`: verified=구글지도 확인, approx=지점 위치 기반)

> 좌표를 더 정확히 하려면 `data.json` / `data.js`의 `lat`,`lng`만 수정하면 됩니다.

## 로컬에서 보기

`index.html`을 브라우저로 그냥 열면 됩니다. (`data.js`를 `<script>`로 불러오므로 서버 없이 동작)

## git → Vercel 배포

```bash
cd supercharger-site
git init
git add .
git commit -m "전국 슈퍼차저 주차정보 지도"
# GitHub에 빈 레포를 만든 뒤:
git remote add origin https://github.com/<사용자명>/<레포명>.git
git branch -M main
git push -u origin main
```

이후 [vercel.com](https://vercel.com) → **Add New Project** → 해당 GitHub 레포 선택 →
프레임워크 프리셋 **Other(정적)** 그대로 두고 **Deploy**. 빌드 설정 없이 바로 배포됩니다.

또는 CLI로:

```bash
npm i -g vercel
vercel        # 프리뷰 배포
vercel --prod # 프로덕션 배포
```

## 출처

데이터: `하이시네 한국 슈퍼차저 정복.xlsx` (하이시네 수집 자료)
