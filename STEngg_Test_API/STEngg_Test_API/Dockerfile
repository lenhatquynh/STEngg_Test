FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["STEngg_Test_API/STEngg_Test_API.csproj", "STEngg_Test_API/"]
RUN dotnet restore "STEngg_Test_API/STEngg_Test_API.csproj"
COPY . .
WORKDIR "/src/STEngg_Test_API"
RUN dotnet build "./STEngg_Test_API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./STEngg_Test_API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "STEngg_Test_API.dll"]
