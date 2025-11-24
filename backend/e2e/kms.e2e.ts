/* Simple E2E smoke test for KMS document flow.
   Creates a document then polls status until it becomes 'active' or times out.
   Usage: npm run e2e:kms --workspace backend
*/

interface CreateDocumentResponse {
  id: string;
  businessId: string;
  sceneId?: string;
  title: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface StatusResponse {
  id: string;
  status: string;
  updatedAt: string;
}

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';
const TIMEOUT_MS = 5000; // overall timeout
const POLL_INTERVAL_MS = 250;

function log(msg: string) {
  process.stdout.write(`[E2E] ${msg}\n`);
}

async function createDocument(): Promise<CreateDocumentResponse> {
  const payload = {
    businessId: 'biz_e2e_' + Date.now(),
    title: 'E2E Sample Doc',
    sceneId: 'scene_e2e_' + Math.floor(Math.random() * 1000)
  };
  const res = await fetch(`${BASE_URL}/api/kms/documents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    throw new Error(`Create failed: ${res.status} ${res.statusText}`);
  }
  const data = (await res.json()) as CreateDocumentResponse;
  return data;
}

async function getStatus(id: string): Promise<StatusResponse> {
  const res = await fetch(`${BASE_URL}/api/kms/documents/${id}/status`);
  if (!res.ok) {
    throw new Error(`Status fetch failed: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as StatusResponse;
}

async function pollUntilActive(id: string): Promise<StatusResponse> {
  const start = Date.now();
  while (Date.now() - start < TIMEOUT_MS) {
    try {
      const status = await getStatus(id);
      log(`Polled status: ${status.status}`);
      if (status.status === 'active') return status;
    } catch (e) {
      log(`Poll error: ${(e as Error).message}`);
    }
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }
  throw new Error('Timeout waiting for active status');
}

async function run() {
  log(`Base URL: ${BASE_URL}`);
  try {
    const created = await createDocument();
    log(`Created document id=${created.id} initialStatus=${created.status}`);
    if (created.status !== 'processing') {
      log('Warning: expected initial status processing');
    }
    const finalStatus = await pollUntilActive(created.id);
    log(`Final status: ${finalStatus.status}`);
    if (finalStatus.status !== 'active') {
      throw new Error('Document did not reach active state');
    }
    log('SUCCESS: Document flow passed');
    process.exit(0);
  } catch (e) {
    log(`FAIL: ${(e as Error).message}`);
    process.exit(1);
  }
}

run();
