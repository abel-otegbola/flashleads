import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import type { CaseStudyBlock, CaseStudyPayload } from "../interface/caseStudy";

const CASE_STUDIES_COLLECTION = "caseStudies";

function sanitizeBlocks(blocks: CaseStudyBlock[]): CaseStudyBlock[] {
  return blocks.map((block) => ({
    ...block,
    content: (block.content || "").trim(),
  }));
}

function sanitizePayload(payload: CaseStudyPayload): CaseStudyPayload {
  return {
    title: payload.title.trim() || "Untitled Case Study",
    blocks: sanitizeBlocks(payload.blocks),
  };
}

async function assertCaseStudyOwnership(caseStudyId: string, userId: string): Promise<void> {
  const ref = doc(db, CASE_STUDIES_COLLECTION, caseStudyId);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    throw new Error("Case study not found");
  }

  const data = snapshot.data();
  if (data.userId !== userId) {
    throw new Error("Unauthorized case study access");
  }
}

export async function saveCaseStudyDraft(
  userId: string,
  payload: CaseStudyPayload,
  caseStudyId?: string,
): Promise<string> {
  const clean = sanitizePayload(payload);

  if (!caseStudyId) {
    const created = await addDoc(collection(db, CASE_STUDIES_COLLECTION), {
      userId,
      ...clean,
      status: "draft",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      publishedAt: null,
    });

    return created.id;
  }

  await assertCaseStudyOwnership(caseStudyId, userId);
  await updateDoc(doc(db, CASE_STUDIES_COLLECTION, caseStudyId), {
    ...clean,
    status: "draft",
    updatedAt: serverTimestamp(),
  });

  return caseStudyId;
}

export async function publishCaseStudy(
  userId: string,
  payload: CaseStudyPayload,
  caseStudyId?: string,
): Promise<string> {
  const clean = sanitizePayload(payload);

  if (!caseStudyId) {
    const created = await addDoc(collection(db, CASE_STUDIES_COLLECTION), {
      userId,
      ...clean,
      status: "published",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      publishedAt: serverTimestamp(),
    });

    return created.id;
  }

  await assertCaseStudyOwnership(caseStudyId, userId);
  await updateDoc(doc(db, CASE_STUDIES_COLLECTION, caseStudyId), {
    ...clean,
    status: "published",
    updatedAt: serverTimestamp(),
    publishedAt: serverTimestamp(),
  });

  return caseStudyId;
}
