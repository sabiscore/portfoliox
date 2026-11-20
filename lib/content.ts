import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';
import { compileMDX } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

import { useMDXComponents as getMDXComponents } from '@/mdx-components';

export interface WritingPost {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  readingTime: number;
  featured?: boolean;
}

export interface WorkCaseMeta {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
}

interface WritingFrontmatter {
  title: string;
  date: string;
  summary: string;
  tags?: string[];
  featured?: boolean;
}

interface WorkFrontmatter {
  title: string;
  summary: string;
  tags?: string[];
}

const WRITING_DIR = path.join(process.cwd(), 'content', 'writing');
const WORK_DIR = path.join(process.cwd(), 'content', 'work');

function getFiles(directory: string) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs.readdirSync(directory).filter((file) => file.endsWith('.mdx'));
}

function calculateReadingTime(content: string) {
  return Math.max(1, Math.ceil(content.split(/\s+/).length / 220));
}

function isSafeContentSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export async function getWritingPosts(): Promise<WritingPost[]> {
  return getFiles(WRITING_DIR)
    .map((file) => {
      const source = fs.readFileSync(path.join(WRITING_DIR, file), 'utf8');
      const { data, content } = matter(source);
      const frontmatter = data as Partial<WritingFrontmatter>;

      return {
        slug: file.replace(/\.mdx$/, ''),
        title: frontmatter.title ?? '',
        date: frontmatter.date ?? '',
        summary: frontmatter.summary ?? '',
        tags: frontmatter.tags ?? [],
        featured: frontmatter.featured ?? false,
        readingTime: calculateReadingTime(content),
      };
    })
    .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());
}

export async function getWritingPost(slug: string) {
  if (!isSafeContentSlug(slug)) {
    return null;
  }

  const filePath = path.join(WRITING_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const source = fs.readFileSync(filePath, 'utf8');
  const { content, frontmatter } = await compileMDX<WritingFrontmatter>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypePrettyCode, { theme: 'github-dark-dimmed', keepBackground: false }],
        ],
      },
    },
    components: getMDXComponents({}),
  });

  return {
    frontmatter,
    content,
    readingTime: calculateReadingTime(matter(source).content),
  };
}

export async function getWorkCases(): Promise<WorkCaseMeta[]> {
  return getFiles(WORK_DIR).map((file) => {
    const source = fs.readFileSync(path.join(WORK_DIR, file), 'utf8');
    const { data } = matter(source);
    const frontmatter = data as Partial<WorkFrontmatter>;

    return {
      slug: file.replace(/\.mdx$/, ''),
      title: frontmatter.title ?? '',
      summary: frontmatter.summary ?? '',
      tags: frontmatter.tags ?? [],
    };
  });
}

export async function getWorkCase(slug: string) {
  if (!isSafeContentSlug(slug)) {
    return null;
  }

  const filePath = path.join(WORK_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const source = fs.readFileSync(filePath, 'utf8');
  const { content, frontmatter } = await compileMDX<WorkFrontmatter>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypePrettyCode, { theme: 'github-dark-dimmed', keepBackground: false }],
        ],
      },
    },
    components: getMDXComponents({}),
  });

  return {
    frontmatter,
    content,
  };
}