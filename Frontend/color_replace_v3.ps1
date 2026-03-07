$srcDir = 'd:\DgtLmart\Tree Campus\Frontend\src'
$files = Get-ChildItem -Path $srcDir -Include '*.jsx','*.js','*.css' -Recurse

$replacements = @(
    # Lingering Orange/Red variants (Case insensitive)
    @{Find='#e55100'; Replace='#0F766E'},
    @{Find='#e55200'; Replace='#0F766E'},
    @{Find='#e54f00'; Replace='#0F766E'},
    @{Find='#ff7a33'; Replace='#22D3EE'},
    @{Find='#ff6b1f'; Replace='#22D3EE'},
    @{Find='#E04E00'; Replace='#0F766E'},
    @{Find='#C84300'; Replace='#0F766E'},
    @{Find='#ff6b1a'; Replace='#22D3EE'},
    @{Find='#D44A00'; Replace='#0F766E'},
    @{Find='#FD5A00'; Replace='#115E59'},
    @{Find='#FD5B00'; Replace='#115E59'},
    @{Find='#FC5A00'; Replace='#115E59'},
    @{Find='#FE8361'; Replace='#14B8A6'},
    @{Find='#FFF5F0'; Replace='#F0FDFA'}, # Background Mint White
    
    # Specific button color request: Buttons Teal Dark #115E59
    # Ensure any teal-500 used on buttons is moved to #115E59
    @{Find='bg-teal-500 hover:bg-teal-600'; Replace='bg-[#115E59] hover:bg-[#0F766E]'},
    @{Find='bg-teal-500'; Replace='bg-[#14B8A6]'}, # General primary teal
    
    # Handle specific Tailwind patterns for buttons
    @{Find='hover:text-orange-500'; Replace='hover:text-[#14B8A6]'},
    @{Find='text-orange-600'; Replace='text-[#14B8A6]'},
    @{Find='border-orange-500'; Replace='border-[#14B8A6]'},
    @{Find='bg-orange-50'; Replace='bg-[#F0FDFA]'}
)

$changedFiles = @()

foreach ($file in $files) {
    try {
        $content = Get-Content $file.FullName -Raw -ErrorAction Stop
        if ($null -eq $content) { continue }
        $original = $content

        foreach ($r in $replacements) {
            # Basic replace
            $content = $content -replace [regex]::Escape($r.Find), $r.Replace
            
            # Case insensitive check for hex codes
            if ($r.Find -match '^#') {
                $content = $content -replace [regex]::Escape($r.Find.ToLower()), $r.Replace
                $content = $content -replace [regex]::Escape($r.Find.ToUpper()), $r.Replace
            }
        }

        if ($content -ne $original) {
            Set-Content -Path $file.FullName -Value $content -NoNewline -ErrorAction Stop
            $changedFiles += $file.FullName.Replace($srcDir + '\', '')
        }
    } catch {
        # Skip if error
    }
}

Write-Host "Total files changed in final pass: $($changedFiles.Count)"
