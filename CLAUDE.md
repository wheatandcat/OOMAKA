# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

OOMAKAは、スケジュール共有アプリケーションです。Next.js App Router、tRPC、Prisma、NextAuth.jsを使用したフルスタックアプリケーションです。

## 開発コマンド

### 基本操作

```bash
# 開発サーバー起動（Turbopack使用）
pnpm run dev

# ビルド
pnpm build

# 本番サーバー起動
pnpm start

# 型チェック
pnpm typecheck
```

### データベース操作

```bash
# マイグレーション実行（本番環境）
pnpm db:migrate

# 開発環境でマイグレーション生成・実行
pnpm db:generate

# データベーススキーマを直接プッシュ
pnpm db:push

# Prisma Studioでデータベース確認
pnpm db:studio
```

### コード品質管理

```bash
# Biomeでコードチェック
pnpm check

# 自動修正（安全な修正のみ）
pnpm check:write

# 自動修正（unsafe含む）
pnpm check:unsafe
```

## アーキテクチャ

### tRPCルーター構成

tRPCルーターは`src/server/api/root.ts`で定義され、以下の3つのルーターで構成:

- **postRouter** (`src/server/api/routers/post.ts`): 投稿関連
- **scheduleRouter** (`src/server/api/routers/schedule.ts`): スケジュール操作（CRUD）
- **urlRouter** (`src/server/api/routers/url.ts`): URL管理

### 認証システム

NextAuth.js v5（beta）を使用:

- **設定**: `src/server/auth/config.ts`
- **プロバイダー**: Discord、Apple、Google
- **アダプター**: Prisma Adapter
- **カスタムサインインページ**: `/auth`

### データベース

- **ORM**: Prisma
- **プロバイダー**: SQLite
- **スキーマ**: `prisma/schema.prisma`

主要モデル:
- `User`, `Account`, `Session`: NextAuth.js認証用
- `Url`: スケジュール共有URL（パスワード保護対応）
- `Schedule`: スケジュールアイテム（日付、絵文字、テキスト）

### tRPCプロシージャタイプ

- **publicProcedure**: 認証不要のエンドポイント
- **protectedProcedure**: 認証必須のエンドポイント（`ctx.session.user`が保証される）

両方とも開発環境で人工的な遅延（100-500ms）を追加する`timingMiddleware`を使用しています。

### パスエイリアス

`tsconfig.json`で`~/`を`./src/`にマッピング:

```typescript
import { db } from "~/server/db";
```

## 環境変数

必須の環境変数は`src/env.js`で定義されています:

- `AUTH_SECRET`: NextAuth.jsシークレット（本番環境のみ必須）
- `AUTH_DISCORD_ID`, `AUTH_DISCORD_SECRET`: Discord認証
- `AUTH_APPLE_ID`, `AUTH_APPLE_SECRET`: Apple認証（オプション）
- `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`: Google認証（オプション）
- `DATABASE_URL`: データベース接続URL

`.env.example`を参照して`.env`ファイルを作成してください。

## 重要な実装パターン

### スケジュール期間検索

`scheduleRouter.fetchInPeriod`は日付範囲でスケジュールを取得します:

```typescript
fetchInPeriod: publicProcedure
  .input(z.object({
    urlId: z.string(),
    startDate: z.date(),
    endDate: z.date(),
  }))
  .query(async ({ ctx, input }) => {
    return ctx.db.schedule.findMany({
      where: {
        urlId: input.urlId,
        date: { gte: input.startDate, lte: input.endDate },
      },
      orderBy: { day: "asc" },
    });
  })
```

### 暗号化ユーティリティ

`src/utils/encryption.ts`にパスワード保護用の暗号化機能があります。

### 共有URL構造

- URLモデルは複数のスケジュールを持つ
- オプションでパスワード保護可能
- userIdはオプション（匿名共有対応）

## プロジェクト初期化について

このプロジェクトはCreate T3 App (v7.39.3)で初期化されており、以下のスタックを使用:

- Next.js 15
- TypeScript（strictモード）
- tRPC
- Prisma
- NextAuth.js
- Tailwind CSS
- Biome（Linter/Formatter）
