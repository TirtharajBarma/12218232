const Log = async (stack, level, pkg, message) => {
  const validStacks = ['frontend', 'backend'];
  const validLevels = ['debug', 'info', 'warn', 'error', 'fatal'];
  const validFrontendPackages = ['component', 'hook', 'page', 'state', 'style'];
  const validBackendPackages = ['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service'];
  const validBothPackages = ['auth', 'config', 'middleware', 'utils'];

  const normalizedStack = stack.toLowerCase();
  const normalizedLevel = level.toLowerCase();
  const normalizedPackage = pkg.toLowerCase();

  if (!validStacks.includes(normalizedStack)) {
    console.error(`Invalid stack: ${stack}. Must be one of: ${validStacks.join(', ')}`);
    return;
  }

  if (!validLevels.includes(normalizedLevel)) {
    console.error(`Invalid level: ${level}. Must be one of: ${validLevels.join(', ')}`);
    return;
  }

  let validPackages = validBothPackages;
  if (normalizedStack === 'frontend') {
    validPackages = [...validFrontendPackages, ...validBothPackages];
  } else if (normalizedStack === 'backend') {
    validPackages = [...validBackendPackages, ...validBothPackages];
  }

  if (!validPackages.includes(normalizedPackage)) {
    console.error(`Invalid package: ${pkg} for stack: ${stack}. Must be one of: ${validPackages.join(', ')}`);
    return;
  }

  const token = import.meta.env.VITE_AUTH_TOKEN;
  const apiUrl = import.meta.env.VITE_LOG_API_URL || 'http://20.244.56.144/evaluation-service/logs';
  
  if (!token) {
    console.error('❌ Authentication token not found in environment variables');
    return;
  }
  
  try {
    const logPayload = { 
      stack: normalizedStack, 
      level: normalizedLevel, 
      package: normalizedPackage, 
      message: message 
    };


    if (import.meta.env.VITE_DEV_MODE === 'true') {
      console.log('📤 Sending log:', logPayload);
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logPayload),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Log submission failed: ${response.status} - ${errorText}`);
      console.error('Request payload was:', logPayload);
      return;
    }
    
    const result = await response.json();
    
    if (import.meta.env.VITE_DEV_MODE === 'true') {
      console.log(`✅ Log sent successfully:`, {
        stack: normalizedStack,
        level: normalizedLevel,
        package: normalizedPackage,
        message: message,
        logID: result.logID || 'no-id'
      });
    }
  } catch (error) {
    console.error(`❌ Log error: ${error.message}`);
    if (import.meta.env.VITE_DEV_MODE === 'true') {
      console.error('Stack trace:', error.stack);
    }
  }
};

export default Log;