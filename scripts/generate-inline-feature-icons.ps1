Set-Location "c:\Users\DELL\Desktop\Abel\Dev\Prospo"

$items = @(
  @{ In="public/features-lead-gen.svg"; Out="src/assets/icons/featureLeadGen.tsx"; Comp="FeatureLeadGenIcon"; W="452"; H="292"; VB="0 0 452 292"; Op="0.16" },
  @{ In="public/features-outreach.svg"; Out="src/assets/icons/featureOutreach.tsx"; Comp="FeatureOutreachIcon"; W="463"; H="151"; VB="0 0 463 151"; Op="0.16" },
  @{ In="public/features-crm.svg"; Out="src/assets/icons/featureCrm.tsx"; Comp="FeatureCrmIcon"; W="471"; H="160"; VB="0 0 471 160"; Op="0.14" },
  @{ In="public/features-social.svg"; Out="src/assets/icons/featureSocial.tsx"; Comp="FeatureSocialIcon"; W="452"; H="328"; VB="0 0 452 328"; Op="0.16" }
)

foreach ($it in $items) {
  $svg = Get-Content -Raw $it.In
  $m = [regex]::Match($svg, '<svg[^>]*>([\s\S]*)</svg>')
  if (-not $m.Success) { throw "Could not parse SVG body for $($it.In)" }

  $bodyJson = ($m.Groups[1].Value.Trim() | ConvertTo-Json -Compress)

  $sb = [System.Text.StringBuilder]::new()
  [void]$sb.AppendLine('import { type SVGProps } from "react";')
  [void]$sb.AppendLine('')
  [void]$sb.AppendLine('interface FeatureIllustrationProps extends SVGProps<SVGSVGElement> {')
  [void]$sb.AppendLine('  mode?: "light" | "dark";')
  [void]$sb.AppendLine('  overlayColor?: string;')
  [void]$sb.AppendLine('  overlayOpacity?: number;')
  [void]$sb.AppendLine('}')
  [void]$sb.AppendLine('')
  [void]$sb.Append('const RAW_SVG_BODY = ')
  [void]$sb.Append($bodyJson)
  [void]$sb.AppendLine(';')
  [void]$sb.AppendLine('')
  [void]$sb.AppendLine('const ' + $it.Comp + ' = ({')
  [void]$sb.AppendLine('  mode = "light",')
  [void]$sb.AppendLine('  overlayColor = "#121212",')
  [void]$sb.AppendLine('  overlayOpacity,')
  [void]$sb.AppendLine('  ...props')
  [void]$sb.AppendLine('}: FeatureIllustrationProps) => {')
  [void]$sb.AppendLine('  const tintOpacity = overlayOpacity ?? (mode === "dark" ? ' + $it.Op + ' : 0);')
  [void]$sb.AppendLine('')
  [void]$sb.AppendLine('  return (')
  [void]$sb.AppendLine('    <svg')
  [void]$sb.AppendLine('      width="' + $it.W + '"')
  [void]$sb.AppendLine('      height="' + $it.H + '"')
  [void]$sb.AppendLine('      viewBox="' + $it.VB + '"')
  [void]$sb.AppendLine('      fill="none"')
  [void]$sb.AppendLine('      xmlns="http://www.w3.org/2000/svg"')
  [void]$sb.AppendLine('      {...props}')
  [void]$sb.AppendLine('    >')
  [void]$sb.AppendLine('      <g dangerouslySetInnerHTML={{ __html: RAW_SVG_BODY }} />')
  [void]$sb.AppendLine('      {tintOpacity > 0 ? <rect width="' + $it.W + '" height="' + $it.H + '" fill={overlayColor} opacity={tintOpacity} /> : null}')
  [void]$sb.AppendLine('    </svg>')
  [void]$sb.AppendLine('  );')
  [void]$sb.AppendLine('};')
  [void]$sb.AppendLine('')
  [void]$sb.AppendLine('export default ' + $it.Comp + ';')

  Set-Content -Path $it.Out -Value $sb.ToString() -Encoding utf8
}

Write-Output "Regenerated all 4 components safely."
