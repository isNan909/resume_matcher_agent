import { createAgentRouter } from '@flue/runtime/routing';
import { init } from '@flue/runtime';
import { Hono } from 'hono';
import { ResumeAgent } from './agents/resume-agent.ts';

const app = new Hono();

// Mount standard Flue Agent route
app.route('/agents/resume-agent', createAgentRouter(ResumeAgent) as unknown as Hono);

// API Endpoint: POST /resume-agent
app.post('/resume-agent', async (c) => {
	let body: any;
	try {
		body = await c.req.json();
	} catch (_err) {
		return c.json({ success: false, error: 'Invalid JSON format' }, 400);
	}

	if (!body || typeof body !== 'object') {
		return c.json({ success: false, error: 'Request body must be a JSON object' }, 400);
	}

	const resume = typeof body.resume === 'string' ? body.resume.trim() : '';
	const jobDescription = typeof body.jobDescription === 'string' ? body.jobDescription.trim() : '';

	if (!resume) {
		return c.json({ success: false, error: 'Resume is required' }, 400);
	}

	if (!jobDescription) {
		return c.json({ success: false, error: 'Job description is required' }, 400);
	}

	try {
		const instanceId = `resume-agent-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
		const agentHandle = init(ResumeAgent, { id: instanceId });

		const promptMessage = `Candidate Resume:\n\n${resume}\n\nTarget Job Description:\n\n${jobDescription}`;

		const receipt = await agentHandle.dispatch(promptMessage);
		const reply = await agentHandle.read(receipt);

		if (!reply || !reply.text) {
			throw new Error('No output returned from agent');
		}

		return c.json({
			success: true,
			result: reply.text,
		}, 200);
	} catch (err: any) {
		console.error('[ResumeAgent Error]:', err?.message || err);

		const errStr = String(err?.message || err);
		const isAuthError = errStr.includes('401') || errStr.includes('auth') || errStr.includes('API key') || errStr.includes('your_openrouter_api_key');

		const errorMessage = isAuthError
			? 'OpenRouter API key is invalid or missing. Please set a valid OPENROUTER_API_KEY in your .env file.'
			: 'Unable to process resume';

		return c.json({
			success: false,
			error: errorMessage,
			details: errStr
		}, 500);
	}
});

export default app;
