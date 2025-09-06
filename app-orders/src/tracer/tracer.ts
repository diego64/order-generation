import { trace } from '@opentelemetry/api'

const OTEL_SERVICE_NAME = process.env.OTEL_SERVICE_NAME || "app-orders";

if (!process.env.OTEL_SERVICE_NAME) {
  throw new Error('OTEL_SERVICE_NAME must be configured.')
}

export const tracer = trace.getTracer(process.env.OTEL_SERVICE_NAME)