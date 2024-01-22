namespace ProjectPlanner.Worker.Services;

using Google.Apis.Auth.OAuth2;
using Google.Apis.Drive.v3;
using Google.Apis.Services;
using Google.Apis.Upload;
using ProjectPlanner.Shared.Models.ProjectEnv;

public class GoogleDriveService
{
    private readonly string driveFolderId;
    private readonly DriveService driveService;
    private readonly ILogger<GoogleDriveService> logger;

    public GoogleDriveService(DriveService driveService, ILogger<GoogleDriveService> logger)
    {
        this.driveService = driveService;
        this.logger = logger;

        var folderIdEnv = Environment.GetEnvironmentVariable(ProjectEnv.BackupDriveFolder)
            ?? throw new Exception($"{ProjectEnv.BackupDriveFolder} environment variable not set");
        driveFolderId = File.ReadAllText(folderIdEnv).Trim();
    }

    public async Task UploadAsync(string filePath)
    {
        var fileMetadata = new Google.Apis.Drive.v3.Data.File()
        {
            Name = Path.GetFileName(filePath),
            Parents = new List<string>() { this.driveFolderId },
        };

        await using var stream = new FileStream(filePath, FileMode.Open);

        var request = driveService.Files.Create(fileMetadata, stream, "application/octet-stream");

        request.ProgressChanged += UploadProgressChanged;
        request.ResponseReceived += UploadResponseReceived;

        await request.UploadAsync();
    }

    private void UploadResponseReceived(Google.Apis.Drive.v3.Data.File file)
    {
        logger.LogInformation(file.Name + " was uploaded successfully");
    }

    private void UploadProgressChanged(IUploadProgress progress)
    {
        if (progress.Exception != null)
        {
            logger.LogError(progress.Exception, "Error uploading file");

            return;
        }

        logger.LogInformation(progress.Status + " " + progress.BytesSent);
    }
}
