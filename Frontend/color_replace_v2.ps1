$srcDir = 'd:\DgtLmart\Tree Campus\Frontend\src'
$files = Get-ChildItem -Path $srcDir -Include '*.jsx','*.js','*.css' -Recurse

$replacements = @(
    # Unhandled coral/orange variants from images and manual checks
    @{Find='#FE8361'; Replace='#14B8A6'},
    @{Find='#ff7a33'; Replace='#22D3EE'},
    @{Find='#ff6b1f'; Replace='#22D3EE'},
    @{Find='#E04E00'; Replace='#0F766E'},
    @{Find='#C84300'; Replace='#0F766E'},
    @{Find='#e55200'; Replace='#0F766E'},
    
    # Specific button color request: Buttons Teal Dark #115E59
    # We'll target bg-teal-500 and replace it with bg-[#115E59] for buttons
    # and also handle hover states
    @{Find='bg-teal-500 hover:bg-teal-600'; Replace='bg-[#115E59] hover:bg-[#0F766E]'},
    @{Find='bg-teal-500'; Replace='bg-[#115E59]'},
    @{Find='hover:bg-teal-600'; Replace='hover:bg-[#0F766E]'},
    
    # Hex versions of buttons if any
    @{Find='bg-[#14B8A6]'; Replace='bg-[#115E59]'},
    @{Find='hover:bg-[#0D9488]'; Replace='hover:bg-[#0F766E]'},
    
    # Gradient endpoints that might have been missed or are still orange-ish
    @{Find='to-[#ff7a33]'; Replace='to-[#22D3EE]'},
    @{Find='to-[#ff6b1f]'; Replace='to-[#22D3EE]'},
    @{Find='to-[#E04E00]'; Replace='to-[#0F766E]'},

    # Ensure focus rings also use the new theme
    @{Find='ring-teal-500'; Replace='ring-[#14B8A6]'}
)

$changedFiles = @()

foreach ($file in $files) {
    try {
        $content = Get-Content $file.FullName -Raw -ErrorAction Stop
        if ($null -eq $content) { continue }
        $original = $content

        foreach ($r in $replacements) {
            $escaped = [regex]::Escape($r.Find)
            $content = $content -replace $escaped, $r.Replace
            
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
        Write-Warning "Failed to process file $($file.FullName): $($_.Exception.Message)"
    }
}

Write-Host "Changed files:"
foreach ($f in $changedFiles) {
    Write-Host "  $f"
}
Write-Host ""
Write-Host "Total files changed: $($changedFiles.Count)"
