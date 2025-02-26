"""This exposes Opentelemetry service."""

import os

from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import (
    OTLPSpanExporter,
)
from opentelemetry.exporter.zipkin.json import ZipkinExporter
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor


def setup_tracing(service_name="forms-flow-api"):
    """Sets up OpenTelemetry tracing for the application."""
    # Check if OpenTelemetry tracing is enabled
    if os.getenv("ENABLE_OPENTELEMETRY", "false").lower() != "true":
        print("OpenTelemetry tracing is disabled.")
        return

    resource = Resource.create({"service.name": service_name})
    trace_provider = TracerProvider(resource=resource)
    trace.set_tracer_provider(trace_provider)

    # Jaeger Exporter (OTLP)
    jaeger_endpoint = os.getenv("JAEGER_ENDPOINT")
    if jaeger_endpoint:
        jaeger_exporter = OTLPSpanExporter(endpoint=jaeger_endpoint, insecure=True)
        jaeger_span_processor = BatchSpanProcessor(jaeger_exporter)
        trace_provider.add_span_processor(jaeger_span_processor)
    else:
        print("Jaeger endpoint not configured. Jaeger tracing will not be enabled.")

    # Zipkin Exporter (HTTP)
    zipkin_endpoint = os.getenv("ZIPKIN_ENDPOINT")
    if zipkin_endpoint:
        zipkin_exporter = ZipkinExporter(endpoint=zipkin_endpoint)
        zipkin_span_processor = BatchSpanProcessor(zipkin_exporter)
        trace_provider.add_span_processor(zipkin_span_processor)
    else:
        print("Zipkin endpoint not configured. Zipkin tracing will not be enabled.")

    print("OpenTelemetry tracing is enabled and configured.")
