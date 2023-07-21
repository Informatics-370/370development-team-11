using Microsoft.EntityFrameworkCore;
using NuGet.Protocol.Core.Types;
using ProcionAPI.Data;
using ProcionAPI.Models.Repositories;
using ProcionAPI.MailKit_Config;
using System;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.Http.Features;
using Hangfire;
using Hangfire.SqlServer;
using ProcionAPI.Models.Repositories.Consumables;
using ProcionAPI.Models.Repositories.Procurement_Requests;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options => options.AddDefaultPolicy(
                include =>
                {
                    include.AllowAnyHeader();
                    include.AllowAnyMethod();
                    include.AllowAnyOrigin();
                }));


builder.Services.AddDbContext<AppDBContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.")));

// Add services to the container.
builder.Services.AddHangfire(configuration => configuration
       .SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
       .UseSimpleAssemblyNameTypeSerializer()
       .UseRecommendedSerializerSettings()
       .UseSqlServerStorage(builder.Configuration.GetConnectionString("DefaultConnection"), new SqlServerStorageOptions
       {
           CommandBatchMaxTimeout = TimeSpan.FromMinutes(5),
           SlidingInvisibilityTimeout = TimeSpan.FromMinutes(5),
           QueuePollInterval = TimeSpan.Zero,
           UseRecommendedIsolationLevel = true,
           DisableGlobalLocks = true
       }));
builder.Services.AddHangfireServer();

builder.Services.AddControllers();


builder.Services.AddControllers().AddNewtonsoftJson(options =>
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
);
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.Configure<MailSettings>(builder.Configuration.GetSection(nameof(MailSettings)));
builder.Services.Configure<FormOptions>(o =>
{
    o.ValueLengthLimit = int.MaxValue;
    o.MultipartBodyLengthLimit = int.MaxValue;
    o.MemoryBufferThreshold = int.MaxValue;
});
builder.Services.AddTransient<IMailService, MailService>();



builder.Services.AddDbContext<AppDBContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<IConsumableRepository, ConsumableRepository>();
builder.Services.AddScoped<IDepartmentRepository, DepartmentRepository>();
builder.Services.AddScoped<IBranchRepository, BranchRepository>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IConsumableCategoryRepository, ConsumableCategoryRepository>();
builder.Services.AddScoped<IBudgetAllocationRepository, BudgetAllocationRepository>();
builder.Services.AddScoped<IHelpRepository, HelpRepository>();
builder.Services.AddScoped<IOnboardRequestRepository, OnboardRequestRepository>();
builder.Services.AddScoped<IVendorRepository, VendorRepository>();
builder.Services.AddScoped<IBackupRepository, BackupRepository>();

builder.Services.AddScoped<IMandateRepository, MandateRepository>();
builder.Services.AddScoped<IDelegationRepository, DelegationRepository>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();
builder.Services.AddScoped<IProcurement_Request_Repository, Procurement_Request_Repository>();
builder.Services.AddScoped<IProcurementDetailsRepository, ProcurementDetailsRepository>();

var app = builder.Build();



// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseHttpsRedirection();
app.UseAuthorization();
app.UseAuthentication();
app.UseHangfireDashboard("/dashboard");

app.MapControllers();

app.Run();

app.UseStaticFiles();
app.UseStaticFiles(new StaticFileOptions()
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"Files")),
    RequestPath = new PathString("/Files")
});
