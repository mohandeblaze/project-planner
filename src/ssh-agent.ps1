Get-Service -Name ssh-agent | Set-Service -StartupType Manual
Start-Service ssh-agent