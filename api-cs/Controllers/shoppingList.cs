using System;
using LiteDB;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using api.Models;

namespace api.Controllers
{
    public abstract class BaseApiController : ControllerBase
    {
        protected void LogRequest(string endpointFromApi)
        {
            string ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown IP";
            string httpMethod = HttpContext.Request.Method;
            string timestamp = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss.fff");
            string logMessage = $"Received request: From {ip}, to {endpointFromApi}, at: {timestamp}, method: {httpMethod}.";
            Log.Information(logMessage);
        }
    }
    [ApiController]
    [Route("api/cs/shoppinglist")]
    public class ShoppingListController : BaseApiController
    {
        private const string DbPath = "app_data.db";

        [HttpGet]
        public IActionResult GetList()
        {
            using var db = new LiteDatabase(DbPath);
            var items = db.GetCollection<ShoppingItem>("items")
                                      .FindAll()
                                      .ToList();
            return Ok(items); // Holt alles ohne Umwege
        }

        // 2. Artikel HINZUFÜGEN (POST: api/shopping?name=Milch)
        [HttpPost]
        public IActionResult AddItem([FromQuery] string name)
        {
            using var db = new LiteDatabase(DbPath);
            var collection = db.GetCollection<ShoppingItem>("items");

            collection.Insert(new ShoppingItem { Name = name });
            return Ok(new { Message = "Hinzugefügt!" });
        }
        [HttpDelete("{id}")]
        public IActionResult DeleteItem(int id)
        {
            using var db = new LiteDatabase(DbPath);
            var collection = db.GetCollection<ShoppingItem>("items");
            bool success = collection.Delete(id);

            if (!success)
            {
                return NotFound(new { Message = $"Artikel mit ID {id} wurde nicht gefunden." });
            }

            return Ok(new { Message = "Gelöscht!" });
        }
        [HttpDelete("all")]
        public IActionResult DeleteAllItems()
        {
            using var db = new LiteDatabase(DbPath);
            var collection = db.GetCollection<ShoppingItem>("items");

            // Löscht absolut alles aus dieser Collection
            int deletedCount = collection.DeleteAll();

            return Ok(new { Message = "Alle Artikel gelöscht!", Count = deletedCount });
        }
    }
}