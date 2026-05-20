$logPath = "C:\Users\HP\.gemini\antigravity\brain\e2fbc660-1003-4337-93e3-80ee05e6bce8\.system_generated\logs\transcript.jsonl"
$lines = Get-Content -Path $logPath
foreach ($line in $lines) {
    if ($line -like '*"type":"USER_INPUT"*' -and $line -like '*Analytics.jsx with this file*') {
        $json = ConvertFrom-Json $line
        $content = $json.content
        $code = $content -replace '(?s)^.*?import React', 'import React'
        $code = $code -replace '(?s)</USER_REQUEST>.*$', ''
        $code | Out-File -FilePath "c:\Users\HP\CXO\frontend_1\src\pages\Analytics_temp.jsx" -Encoding utf8
        Write-Output "Successfully extracted code to Analytics_temp.jsx"
        break
    }
}
