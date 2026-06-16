package com.example.linkedinai.controller;

import com.example.linkedinai.model.request;
import com.example.linkedinai.model.response;
import com.example.linkedinai.service.GeminiService;
import com.example.linkedinai.service.requestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class requestController {
        @Autowired
        private requestService service;

        @PostMapping("/generate-message")
        public response generateMessage(@RequestBody request request) {
                return service.generateMessages(request);
                }
}
