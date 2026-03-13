import { useState } from 'react';
import { Copy, ExternalLink, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ApiEndpoint {
  method: string;
  path: string;
  description: string;
  queryParams?: { name: string; type: string; required: boolean; description: string }[];
  example: string;
  response: string;
}

const API_BASE_URL = 'http://localhost:3001';

const endpoints: ApiEndpoint[] = [
  {
    method: 'GET',
    path: '/api/email/address',
    description: 'Get a new random or specific email address with session token',
    queryParams: [
      {
        name: 'domain',
        type: 'string',
        required: false,
        description: 'Email domain (optional, random if not specified)',
      },
    ],
    example: `${API_BASE_URL}/api/email/address?domain=guerrillamail.com`,
    response: `{
  "success": true,
  "email": "user@guerrillamail.com",
  "sid_token": "abc123...",
  "timestamp": 1234567890,
  "domain": "guerrillamail.com"
}`,
  },
  {
    method: 'GET',
    path: '/api/email/messages',
    description: 'Get all messages for a specific email address',
    queryParams: [
      {
        name: 'sid_token',
        type: 'string',
        required: true,
        description: 'Session token from address endpoint',
      },
      {
        name: 'offset',
        type: 'number',
        required: false,
        description: 'Pagination offset (default: 0)',
      },
    ],
    example: `${API_BASE_URL}/api/email/messages?sid_token=abc123...&offset=0`,
    response: `{
  "success": true,
  "messages": [
    {
      "id": "1234567",
      "from": "sender@example.com",
      "subject": "Email subject",
      "excerpt": "Email preview...",
      "timestamp": "1234567890",
      "read": false
    }
  ],
  "total_count": 5
}`,
  },
  {
    method: 'GET',
    path: '/api/email/fetch',
    description: 'Get the full content of a specific email',
    queryParams: [
      {
        name: 'sid_token',
        type: 'string',
        required: true,
        description: 'Session token',
      },
      {
        name: 'email_id',
        type: 'string',
        required: true,
        description: 'Email ID from messages list',
      },
    ],
    example: `${API_BASE_URL}/api/email/fetch?sid_token=abc123...&email_id=1234567`,
    response: `{
  "success": true,
  "email": {
    "id": "1234567",
    "from": "sender@example.com",
    "to": "user@guerrillamail.com",
    "subject": "Email subject",
    "body": "<html>Email content...</html>",
    "timestamp": "1234567890",
    "content_type": "text/html"
  }
}`,
  },
  {
    method: 'GET',
    path: '/api/email/domains',
    description: 'Get list of available email domains',
    example: `${API_BASE_URL}/api/email/domains`,
    response: `{
  "success": true,
  "domains": [
    "guerrillamail.com",
    "guerrillamailblock.com",
    "guerrillamail.net",
    ...
  ]
}`,
  },
];

const ApiDirectory = () => {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const copyToClipboard = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">API Directory</h1>
          <p className="text-muted-foreground text-lg">
            Guerrilla Mail API endpoints for temporary email management
          </p>
        </div>

        {/* Quick Start */}
        <Card className="mb-8 p-6 bg-secondary/30 border-primary/20">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Quick Start</h2>
              <p className="text-muted-foreground mb-4">
                1. Get an email address using the address endpoint
              </p>
              <p className="text-muted-foreground mb-4">
                2. Use the returned sid_token to fetch messages
              </p>
              <p className="text-muted-foreground">
                3. Fetch individual emails for full content
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                copyToClipboard(
                  `curl "${API_BASE_URL}/api/email/address"`,
                  'quickstart'
                )
              }
              className="gap-2"
            >
              <Copy className="w-4 h-4" />
              {copiedEndpoint === 'quickstart' ? 'Copied!' : 'Copy cURL'}
            </Button>
          </div>
        </Card>

        {/* API Endpoints */}
        <div className="space-y-6">
          {endpoints.map((endpoint, idx) => (
            <Card key={idx} className="overflow-hidden border-border/50">
              <div className="bg-secondary/20 border-b border-border/50 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`px-3 py-1 rounded text-xs font-bold ${
                      endpoint.method === 'GET'
                        ? 'bg-blue-500/20 text-blue-700 dark:text-blue-400'
                        : 'bg-green-500/20 text-green-700 dark:text-green-400'
                    }`}
                  >
                    {endpoint.method}
                  </span>
                  <code className="text-sm font-mono text-foreground flex-1">
                    {endpoint.path}
                  </code>
                </div>
                <p className="text-muted-foreground">{endpoint.description}</p>
              </div>

              <div className="p-6 space-y-6">
                {/* Query Parameters */}
                {endpoint.queryParams && endpoint.queryParams.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      Query Parameters
                    </h4>
                    <div className="space-y-2">
                      {endpoint.queryParams.map((param, i) => (
                        <div key={i} className="flex flex-col gap-1 text-sm">
                          <div className="flex items-center gap-2">
                            <code className="text-primary font-mono">
                              {param.name}
                            </code>
                            <span className="text-xs bg-muted px-2 py-1 rounded">
                              {param.type}
                            </span>
                            {param.required && (
                              <span className="text-xs text-red-600 font-semibold">
                                Required
                              </span>
                            )}
                          </div>
                          <p className="text-muted-foreground ml-2">
                            {param.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Example */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Example Request</h4>
                  <div className="bg-muted/50 rounded p-4 flex items-start gap-2 group">
                    <code className="text-xs font-mono text-foreground flex-1 break-all">
                      {endpoint.example}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(endpoint.example, idx + 'example')}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Response */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Response Example</h4>
                  <div className="bg-muted/50 rounded p-4">
                    <pre className="text-xs font-mono text-foreground overflow-x-auto">
                      {endpoint.response}
                    </pre>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Available Domains */}
        <Card className="mt-8 p-6 border-border/50">
          <h3 className="text-lg font-semibold mb-4">Available Domains</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {[
              'guerrillamail.com',
              'guerrillamailblock.com',
              'guerrillamail.net',
              'guerrillamail.org',
              'guerrillamail.de',
              'grr.la',
              'sharklasers.com',
              'guerrillamail.info',
              'spam4.me',
            ].map((domain) => (
              <div
                key={domain}
                className="bg-secondary/30 rounded p-2 text-xs text-muted-foreground text-center border border-border/30"
              >
                {domain}
              </div>
            ))}
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            API server runs on{' '}
            <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
              {API_BASE_URL}
            </code>
          </p>
          <p className="mt-2">
            Powered by{' '}
            <a
              href="https://guerrillamail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              Guerrilla Mail <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiDirectory;
