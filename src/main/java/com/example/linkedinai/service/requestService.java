package com.example.linkedinai.service;

import com.example.linkedinai.model.request;
import com.example.linkedinai.model.response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class requestService implements ResponseService {

        @Autowired
        private GeminiService geminiService;

        public response generateMessages(request request) {

            String message = geminiService.generateMessages(request);

            return new response(message);
        }
}
